export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 px-4 pb-6 pt-4 sidebar:bg-surface-primary sidebar:px-4 dark:border-zinc-700 md:border-t-0 md:px-12 md:pb-10 sidebar:md:bg-transparent sidebar:md:px-12 sidebar:md:pt-8 sidebar:lg:pl-6 sidebar:lg:pr-9">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-2 sidebar:max-w-[1648px] md:h-6 md:flex-row md:justify-between">
        <p className="text-center text-xs font-medium leading-none">
          Made with 💗 by the L2BEAT team
        </p>
        <p className="text-center text-xs font-medium leading-none md:text-right">
          Copyright {currentYear} L2BEAT
        </p>
      </div>
    </footer>
  )
}
