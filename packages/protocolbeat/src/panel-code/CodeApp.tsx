import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppModule } from '../routing/utils'
import { CodePage } from './CodePage'

const queryClient = new QueryClient()

export const CodeAppModule: AppModule = {
  name: 'diff',
  routes: [{ path: '/address/:address', element: <CodePage /> }],
  root: (children) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  },
}
