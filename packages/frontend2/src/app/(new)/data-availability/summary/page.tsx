import { layer2s } from '@l2beat/config'
import {
  type DaLayer,
  daLayers,
} from '@l2beat/config/build/src/projects/other/da-beat'
import { notUndefined } from '@l2beat/shared-pure'
import { type DataAvailabilityProvider } from './_components/table/columns'
import { DaSummaryTable } from './_components/table/da-summary-table'

export default function Page() {
  return (
    <div>
      <header
        className="mb-4 flex flex-col justify-between text-base md:flex-row"
        data-role="chart-header"
      >
        <div>
          <h1 className="mb-1 text-3xl font-bold">Summary</h1>
          <p className="hidden text-gray-500 dark:text-gray-600 md:block">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            semper massa et magna consectetur venenatis. Fusce porta nisi at
            nibh varius blandit at sed neque. Suspendisse elementum vulputate
            blandit. Vivamus at commodo mauris. Donec ultricies ac erat sit amet
            finibus. Pellentesque mollis eros risus. Nam posuere ut elit
            fringilla interdum.
          </p>
        </div>
      </header>
      <DaSummaryTable items={daLayers.map(daLayerToEntry)} />
    </div>
  )
}

function daLayerToEntry(daLayer: DaLayer): DataAvailabilityProvider {
  return {
    slug: daLayer.display.slug,
    daLayer: daLayer.display.name,
    daBridge: daLayer.bridges.map((bridge) => {
      return {
        name: bridge.display.name,
        network: 'Base',
      }
    })[0]!,
    risks: {},
    tvs: Math.random() * 1_000_000_000,
    economicSecurity: Math.random() * 1_000_000_000,
    layerType: daLayer.kind.display,
    usedBy: daLayer.usedIn
      .map(
        (projectId) => layer2s.find((l2) => l2.id === projectId)?.display.name,
      )
      .filter(notUndefined),
  }
}
