import { daLayers } from '@l2beat/config/build/src/projects/other/da-beat'
import { getDaLayerEntry } from '../_utils/get-da-entry'
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
      <DaSummaryTable items={daLayers.flatMap(getDaLayerEntry)} />
    </div>
  )
}
