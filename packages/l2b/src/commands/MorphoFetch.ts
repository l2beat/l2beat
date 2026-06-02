import { command, number, option } from 'cmd-ts'
import {
  fetchMorphoData,
  writeMorphoData,
} from '../implementations/morpho/fetchMorphoData'

export const MorphoFetch = command({
  name: 'morpho-fetch',
  description:
    'Fetch recent Morpho vaults and markets from Ethereum and write them to the morpho project as morphoData.json, which discovery then reuses.',
  args: {
    days: option({
      type: number,
      long: 'days',
      description:
        'Only include vaults/markets created within the last N days.',
      defaultValue: () => 10,
    }),
  },
  handler: async (args) => {
    const data = await fetchMorphoData(args.days)
    const outPath = writeMorphoData(data)
    console.log('')
    console.log(
      `Wrote ${data.entries.length} markets, ${data.vaults.length} vaults`,
    )
    console.log(
      `  vaults with in-window markets: ${Object.keys(data.vaultMarkets).length}`,
    )
    console.log(`  -> ${outPath}`)
  },
})
