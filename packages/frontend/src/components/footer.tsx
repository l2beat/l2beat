export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mx-auto flex max-w-[1216px] flex-col gap-2 border-t border-gray-200 px-4 pb-6 pt-4 sidebar:max-w-[1648px] sidebar:bg-surface-primary sidebar:px-4 dark:border-zinc-700 md:flex-row md:justify-between md:border-t-0 md:px-12 sidebar:md:bg-transparent sidebar:md:px-12 sidebar:lg:pl-6 sidebar:lg:pr-9">
      <p className="text-center text-xs font-medium">
        Made with 💗 by the L2BEAT team
      </p>
      <p className="text-center text-xs font-medium md:text-right">
        Copyright {currentYear} L2BEAT
      </p>
    </footer>
  )
}
