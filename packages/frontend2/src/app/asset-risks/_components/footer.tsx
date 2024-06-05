import Link from 'next/link'
import { type ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'

export function Footer({ className }: { className?: ClassNameValue }) {
  return (
    <footer className="md:py-6 py-4 w-full flex justify-center bg-[#E6E7EC]">
      <div
        className={cn(
          'flex flex-row w-full gap-4 justify-between font-medium text-xs text-zinc-500 dark:text-gray-50 px-[8px]',
          className,
        )}
      >
        <p className="text-center md:text-left">
          Made with ❤️ by{' '}
          <Link
            href={'https://l2beat.com'}
            target="_blank"
            className="text-blue-700 dark:text-blue-500 underline underline-offset-2"
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
