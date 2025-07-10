import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const fullConfig = {}
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': Object.keys(fullConfig).map((key) => `text-${key}`),
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
