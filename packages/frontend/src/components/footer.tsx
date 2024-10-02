export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mx-auto flex max-w-[1216px] justify-between px-4 pb-8 sidebar:max-w-[1648px] sidebar:px-2 md:px-12 sidebar:md:px-6 sidebar:lg:pl-0">
      <p className="text-sm font-medium">
        Made with 💗 by the L2BEAT research team.
      </p>
      <p className="text-right text-sm font-medium">
        Copyright {currentYear} L2BEAT
      </p>
    </footer>
  )
}
