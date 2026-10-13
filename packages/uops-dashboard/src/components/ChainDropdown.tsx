import { SUPPORTED_CHAINS } from '@/chains'

export function ChainDropdown({
  chain,
  setChain,
}: {
  chain: string
  setChain: (chain: string) => void
}) {
  return (
    <div className="relative mb-5">
      <select
        id="chain"
        value={chain}
        onChange={(e) => setChain(e.target.value as string)}
        className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-gray-900 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        {SUPPORTED_CHAINS.sort((a, b) => a.name.localeCompare(b.name)).map(
          (chain) => (
            <option value={chain.id} key={chain.id}>
              {chain.name}
            </option>
          ),
        )}
      </select>
      <svg
        aria-hidden="true"
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-5 w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 8l4 4 4-4" />
      </svg>
    </div>
  )
}
