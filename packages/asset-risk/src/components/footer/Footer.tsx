import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-8">
      <div className="max-w-[1176px] mx-auto flex grid-cols-2 flex-col gap-4 px-4 md:grid md:px-12 font-medium text-xs text-zinc-500 dark:text-gray-50">
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
