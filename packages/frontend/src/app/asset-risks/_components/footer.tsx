import Link from 'next/link'
import { type ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'

export function Footer({ className }: { className?: ClassNameValue }) {
  return (
    <footer className="flex w-full justify-center bg-n-gray-200 py-4 md:py-6">
      <div
        className={cn(
          'flex w-full flex-row justify-between gap-4 px-[8px] text-xs font-medium text-zinc-500 dark:text-gray-50',
          className,
        )}
      >
        <p className="text-center md:text-left">
          Made with ❤️ by{' '}
          <Link
            href={'https://l2beat.com'}
            target="_blank"
            className="text-blue-700 underline underline-offset-2 dark:text-blue-500"
          >
            L2BEAT
          </Link>
        </p>
        <p className="text-center md:text-right">
          © Copyright {new Date().getFullYear()} L2BEAT
        </p>
      </div>
    </footer>
  )
}
