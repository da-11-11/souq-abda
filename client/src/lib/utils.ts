import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

export function resolveImageUrl(image: string): string {
  if (/^(https?:)?\/\//.test(image) || image.startsWith("data:")) {
    return image;
  }
  return import.meta.env.BASE_URL + image.replace(/^\//, "");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
