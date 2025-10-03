import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const fontSize = [
  'heading-64',
  'heading-48',
  'heading-44',
  'heading-40',
  'heading-36',
  'heading-32',
  'heading-28',
  'heading-24',
  'heading-20',
  'heading-18',
  'heading-16',
  'subtitle-14',
  'subtitle-12',
  'subtitle-11',
  'subtitle-10',
  'label-value-24',
  'label-value-20',
  'label-value-18',
  'label-value-16',
  'label-value-15',
  'label-value-14',
  'label-value-13',
  'label-value-12',
  'paragraph-18',
  'paragraph-16',
  'paragraph-15',
  'paragraph-14',
  'paragraph-13',
]

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': fontSize.map((key) => `text-${key}`),
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
