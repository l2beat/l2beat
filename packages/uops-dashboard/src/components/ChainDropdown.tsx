import { SUPPORTED_CHAINS } from '@/chains'

export function ChainDropdown({
  chain,
  setChain,
}: {
  chain: string
  setChain: (chain: string) => void
}) {
  return (
    <div className="mb-5">
      <select
        id="chain"
        value={chain}
        onChange={(e) => setChain(e.target.value as string)}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        {SUPPORTED_CHAINS.sort((a, b) => a.name.localeCompare(b.name)).map(
          (chain) => (
            <option value={chain.id} key={chain.id}>
              {chain.name}
            </option>
          ),
        )}
      </select>
    </div>
  )
}
