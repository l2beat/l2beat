import { trpcTransformer } from '@l2beat/shared-pure'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { TvsDisplayControlsContextProvider } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { L2SummaryEntry } from '~/server/features/layer2s/summary/getL2SummaryEntries'
import type { AppRouter } from '~/server/trpc/root'
import { renderOnServer } from '~/test/table'
import { TRPCProvider } from '~/trpc/React'
import { L2SummaryRollupsTable } from './L2SummaryRollupsTable'

/**
 * Renders the table inside the providers the summary page gives it. Queries do
 * not run on the server, so the tRPC client is never called and the table
 * renders without TVS data, as in the page's server-rendered HTML.
 */
export function renderL2SummaryRollupsTable(entries: L2SummaryEntry[]) {
  const queryClient = new QueryClient()
  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      httpBatchStreamLink({
        transformer: trpcTransformer,
        url: 'http://localhost/api/trpc',
      }),
    ],
  })
  return renderOnServer(
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <TvsDisplayControlsContextProvider
          initialValues={{
            excludeAssociatedTokens: false,
            excludeRwaRestrictedTokens: false,
          }}
        >
          <TableSortingProvider initialSort={{ id: 'total', desc: true }}>
            <TooltipProvider>
              <L2SummaryRollupsTable entries={entries} />
            </TooltipProvider>
          </TableSortingProvider>
        </TvsDisplayControlsContextProvider>
      </TRPCProvider>
    </QueryClientProvider>,
  )
}
