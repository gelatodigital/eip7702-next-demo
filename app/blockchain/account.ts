import { useMutation, useQuery as useQuery_ } from '@tanstack/react-query'
import {
  type Address,
  type Hex,
  type PrivateKeyAccount,
  bytesToHex,
  concat,
  encodePacked,
  hexToBytes,
  keccak256,
  parseSignature,
  size,
  slice,
} from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'
import { signAuthorization } from 'viem/experimental'
import {
  type PublicKey,
  createCredential,
  parsePublicKey,
  sign,
} from 'webauthn-p256'

import { type Client, queryClient } from './config'
import { ExperimentDelegation } from './contracts'

export namespace Account {
  /////////////////////////////////////////////////////////
  // Types
  /////////////////////////////////////////////////////////

  export type Account = {
    address: Address
    authTransactionHash?: Hex
    key: {
      id: string
      publicKey: {
        x: bigint
        y: bigint
      }
    }
  }

  export type Calls = { to: Address; value?: bigint; data?: Hex }[]

  /////////////////////////////////////////////////////////
  // Actions
  /////////////////////////////////////////////////////////

  /**
   * Generates a new EOA and injects the ExperimentDelegation contract onto it
   * with an authorized WebAuthn public key.
   */
  export async function create({ client, addLog }: { 
    client: Client;
    addLog?: (message: string | JSX.Element) => void;
  }) {
    // Generate a new EOA. This Account will be used to inject the ExperimentDelegation
    // contract onto it.
    const account = privateKeyToAccount(generatePrivateKey())
    addLog?.('Generating a new Account with a random private key...')

    // Create a WebAuthn credential which will be used as an authorized key
    // for the EOA.
    addLog?.('Creating a WebAuthn key (Passkey) for secure authentication...')
    const credential = await createCredential({
      user: {
        name: `Example Delegation (${truncate(account.address)})`,
        id: hexToBytes(account.address),
      },
    })

    const publicKey = parsePublicKey(credential.publicKey)

    // Authorize the WebAuthn key on the EOA.
    addLog?.('Signing authorization to set up the delegation contract...')
    const hash = await authorize({
      account,
      client,
      publicKey,
    })

    addLog?.('Finalizing setup by sending the authorization transaction...')
    await waitForTransactionReceipt(client, { hash })

    queryClient.setQueryData(['account'], {
      address: account.address,
      authTransactionHash: hash,
      key: {
        id: credential.id,
        publicKey,
      },
    })

    return hash
  }

  /**
   * Authorizes a WebAuthn public key on an EOA by sending an EIP-7702 authorization
   * transaction to inject the ExperimentDelegation contract onto it.
   */
  export async function authorize({
                                    account,
                                    client,
                                    publicKey,
                                  }: { account: PrivateKeyAccount; client: Client; publicKey: PublicKey }) {
    const nonce = BigInt(0) // initial nonce will always be 0
    const expiry = BigInt(0) // no expiry

    // Compute digest to sign for the authorize function.
    const digest = keccak256(
      encodePacked(
        ['uint256', 'uint256', 'uint256', 'uint256'],
        [nonce, publicKey.x, publicKey.y, expiry],
      ),
    )

    // Sign the authorize digest and parse signature to object format required by
    // the contract.
    const signature = parseSignature(await account.sign({ hash: digest }))

    // Sign an EIP-7702 authorization to inject the ExperimentDelegation contract
    // onto the EOA.
    const authorization = await signAuthorization(client, {
      account,
      contractAddress: ExperimentDelegation.address,
      delegate: true,
    })

    // Send an EIP-7702 contract write to authorize the WebAuthn key on the EOA.
    const hash = await writeContract(client, {
      abi: ExperimentDelegation.abi,
      address: account.address,
      functionName: 'authorize',
      args: [
        {
          x: publicKey.x,
          y: publicKey.y,
        },
        expiry,
        {
          r: BigInt(signature.r),
          s: BigInt(signature.s),
          yParity: signature.yParity,
        },
      ],
      authorizationList: [authorization],
      account: null, // defer to sequencer to fill
    })

    return hash
  }

  /**
   * Imports an existing EOA that holds an authorized WebAuthn public key
   * into account state.
   */
  export async function load({ client }: { client: Client }) {
    // Sign an empty hash to extract the user's WebAuthn credential.
    const { raw } = await sign({
      hash: '0x',
    })

    // Extract the EOA address from the WebAuthn user handle.
    const response = raw.response as AuthenticatorAssertionResponse
    const address = bytesToHex(new Uint8Array(response.userHandle!))

    // Extract the authorized WebAuthn key from the delegated EOA's contract.
    const [, , publicKey] = await readContract(client, {
      address,
      abi: ExperimentDelegation.abi,
      functionName: 'keys',
      args: [BigInt(0)],
    })

    queryClient.setQueryData(['account'], {
      address,
      delegation: ExperimentDelegation.address,
      key: {
        id: raw.id,
        publicKey,
      },
    })
  }

  /**
   * Executes calls with the delegated EOA's WebAuthn credential.
   */
  export async function execute({
    account,
    calls,
    client,
    addLog,
  }: {
    account: Account
    calls: Calls
    client: Client
    addLog?: (message: string | JSX.Element) => void
  }) {
    // Fetch the next available nonce from the delegated EOA's contract.
    let nonce = await readContract(client, {
      abi: ExperimentDelegation.abi,
      address: account.address,
      functionName: 'nonce',
    })

    // Encode calls into format required by the contract.
    const calls_encoded = concat(
      calls.map((call) =>
        encodePacked(
          ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
          [
            0,
            call.to,
            call.value ?? BigInt(0),
            BigInt(size(call.data ?? '0x')),
            call.data ?? '0x',
          ],
        ),
      ),
    )

    // Compute digest to sign for the execute function.
    const digest = keccak256(
      encodePacked(['uint256', 'bytes'], [nonce, calls_encoded]),
    )

    addLog?.('Prompting the end-user to sign over the calls with their WebAuthn key(Passkey)')
    // Sign the digest with the authorized WebAuthn key.
    const { signature, webauthn } = await sign({
      hash: digest,
      credentialId: account.key.id,
    })

    // Extract r and s values from signature.
    const r = BigInt(slice(signature, 0, 32))
    const s = BigInt(slice(signature, 32, 64))
    const mintCalls = calls.map((call) => { return { target: call.to as `0x${string}`, callData: call.data as `0x${string}` } })

    // addLog?.('Invoking the execute function on the Account with the calls and the WebAuthn signature...')
    addLog?.('Using P256 Precompile to verify the WebAuthn signature...')

    addLog?.('Broadcasting transaction to the Sequencer...')
    let hash = await writeContract(client, {
      abi: ExperimentDelegation.abi,
      address: account.address,
      functionName: 'aggregate',
      args: [mintCalls],
      account: null, // defer to sequencer to fill
    })

    let rec = await waitForTransactionReceipt(client, { hash });
    return hash
  }

  /////////////////////////////////////////////////////////
  // Query
  /////////////////////////////////////////////////////////

  const queryKey = ['account']

  export function useQuery() {
    return useQuery_<Account>({ queryKey })
  }

  export function useCreate({ client, addLog }: { 
    client: Client;
    addLog?: (message: string | JSX.Element) => void;
  }) {
    return useMutation({
      mutationFn: async () => await create({ client, addLog }),
    })
  }

  export function useExecute({ client, addLog }: { 
    client: Client;
    addLog?: (message: string | JSX.Element) => void;
  }) {
    return useMutation({
      mutationFn: async ({
        account,
        calls,
      }: {
        account: Account
        calls: Calls
      }) => await execute({ account, calls, client, addLog }),
    })
  }

  export function useLoad({ client }: { client: Client }) {
    return useMutation({
      mutationFn: async () => await load({ client }),
    })
  }
}

function truncate(
  str: string,
  { start = 8, end = 6 }: { start?: number; end?: number } = {},
) {
  if (str.length <= start + end) return str
  return `${str.slice(0, start)}\u2026${str.slice(-end)}`
}