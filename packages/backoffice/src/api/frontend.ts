import { v } from '@l2beat/validate'
import {
  type Environment,
  useEnvironment,
} from '~/components/environment/EnvironmentContext'

const FrontendChains = v.array(
  v.object({
    id: v.string(),
    isUpcoming: v.boolean(),
  }),
)

export type FrontendChain = v.infer<typeof FrontendChains>[number]

function createFrontendClient(baseUrl: string) {
  return {
    chains: {
      getAll: async (): Promise<FrontendChain[]> => {
        const response = await fetch(`${baseUrl}/api/interop/chains`)
        if (!response.ok) {
          throw new Error(
            `Failed to fetch frontend chains from ${baseUrl}: ${response.status}`,
          )
        }
        return FrontendChains.parse(await response.json())
      },
    },
  }
}

export type FrontendApi = ReturnType<typeof createFrontendClient>

const LOCAL_FRONTEND_URL =
  (import.meta.env.VITE_LOCAL_FRONTEND_URL as string | undefined) ??
  'http://localhost:3000'

const productionFrontendApi: FrontendApi =
  createFrontendClient('https://l2beat.com')
const stagingFrontendApi: FrontendApi = createFrontendClient(
  'https://fe-stag.l2beat.com',
)
const localFrontendApi: FrontendApi = createFrontendClient(LOCAL_FRONTEND_URL)

const FRONTENDS: Record<Environment, FrontendApi> = {
  production: productionFrontendApi,
  staging: stagingFrontendApi,
  local: localFrontendApi,
}

export function useFrontendApi(env?: Environment): FrontendApi {
  const { environment } = useEnvironment()
  return FRONTENDS[env ?? environment]
}
