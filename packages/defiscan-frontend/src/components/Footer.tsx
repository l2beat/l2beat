export function Footer() {
  return (
    <footer className="bg-bg-dark text-gray-400 py-8 mt-16">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p>
          Built by{' '}
          <a
            href="https://deficollective.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            The DeFi Collective
          </a>
        </p>
        <p className="text-gray-500">
          DeFiScan — Advancing DeFi transparency
        </p>
      </div>
    </footer>
  )
}
