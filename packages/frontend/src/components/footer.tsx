export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mx-auto flex max-w-[1648px] justify-between pb-8">
      <p className="text-sm font-medium">
        Made with 💗 by the L2BEAT research team.
      </p>
      <p className="text-right text-sm font-medium">
        Copyright {currentYear} L2BEAT
      </p>
    </footer>
  )
}
