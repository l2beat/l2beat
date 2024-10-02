export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mx-auto flex max-w-[1216px] justify-between px-4 pb-8 v2:max-w-[1648px] v2:px-2 md:px-12 v2:md:px-6 v2:lg:pl-0">
      <p className="text-sm font-medium">
        Made with 💗 by the L2BEAT research team.
      </p>
      <p className="text-right text-sm font-medium">
        Copyright {currentYear} L2BEAT
      </p>
    </footer>
  )
}
