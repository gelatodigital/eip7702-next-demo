import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getWindowsVersion = (osVersion: string) => {
  const windowsVersionRegex = /NT (\d+\.\d+)/;
  const match = osVersion.match(windowsVersionRegex);
  if (match) return parseInt(match[1], 10);
  return 0;
};
