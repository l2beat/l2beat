import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { BasicTable } from '~/app/_components/table/basic-table'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { getDefaultMetadata } from '~/utils/get-default-metadata'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/liveness',
  },
})

export default async function Page() {
  const tvl = await getLatestTvlUsd({ type: 'all' })

  return (
    <div className="space-y-8">
      <div>
        <SimplePageHeader>Liveness</SimplePageHeader>
        <p className="my-4 rounded-lg bg-yellow-500 p-2 text-center font-medium text-black text-xs">
          Please note, the values on the page{' '}
          <span className="font-extrabold">do not</span> reflect the time to
          finality (the time it would take for your L2 transaction to be
          finalized on the L1 after it has been submitted).
        </p>
      </div>
      <BasicTable
        table={table}
        onResetFilters={() => setFilters(DEFAULT_DA_SCALING_FILTERS)}
      />
    </div>
  )
}
