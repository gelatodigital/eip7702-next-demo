import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Converts a timestamp to a human-readable relative time string (e.g., "5 minutes ago")
 * @param timestamp - ISO string or any format accepted by Date constructor
 * @returns A human-readable string representing the relative time
 */
export const formatRelativeTime = (timestamp: string) => {
  try {
    const now = new Date().getTime();
    const past = new Date(timestamp).getTime();
    const diff = now - past;

    // Convert to minutes
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;

    // Convert to hours
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;

    // Convert to days
    const days = Math.floor(hours / 24);
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  } catch (error) {
    return "";
  }
};

/**
 * Truncates a hash string to display only the first and last few characters
 * @param hash - The hash string to truncate
 * @returns A string with the first 6 characters and last 4 characters of the hash
 */
export const truncateHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};
