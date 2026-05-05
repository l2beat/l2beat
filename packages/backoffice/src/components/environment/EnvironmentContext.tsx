import { v } from '@l2beat/validate'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useLocalStorage } from '~/hooks/useLocalStorage'

export type Environment = 'local' | 'staging' | 'production'

export interface EnvironmentConfig {
  label: string
  url: string
  classNames: {
    dot: string
  }
}

const ENVIRONMENTS = {
  ...(import.meta.env.DEV
    ? {
        local: {
          label: 'Local',
          url: '/trpc/local',
          classNames: {
            dot: 'bg-environment-local',
          },
        },
      }
    : {}),
  staging: {
    label: 'Staging',
    url: '/trpc/staging',
    classNames: {
      dot: 'bg-environment-staging',
    },
  },
  production: {
    label: 'Production',
    url: '/trpc/production',
    classNames: {
      dot: 'bg-environment-production',
    },
  },
} as const

const STORAGE_KEY = 'backoffice-environment'

const environmentSchema = v.enum(['local', 'staging', 'production'])

interface EnvironmentContextValue {
  environment: Environment
  setEnvironment: (environment: Environment) => void
  config: EnvironmentConfig
  allConfigs: { id: Environment; config: EnvironmentConfig }[]
}

const EnvironmentContext = createContext<EnvironmentContextValue | null>(null)

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useLocalStorage<Environment>(
    STORAGE_KEY,
    ENVIRONMENTS.local ? 'local' : 'production',
    environmentSchema,
  )

  // If a non-local environment is somehow stored on a local host, leave it
  // alone (the user explicitly chose it). But if "local" is stored on a
  // deployed host where it makes no sense, fall back to production.
  useEffect(() => {
    if (environment === 'local' && !ENVIRONMENTS.local) {
      setEnvironment('production')
    }
  }, [environment, setEnvironment])

  const value = useMemo<EnvironmentContextValue>(() => {
    const config = ENVIRONMENTS[environment] ?? ENVIRONMENTS.production

    return {
      environment,
      setEnvironment,
      config,
      allConfigs: Object.entries(ENVIRONMENTS).map(([key, value]) => ({
        id: key as Environment,
        config: value,
      })),
    }
  }, [environment, setEnvironment])

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironment(): EnvironmentContextValue {
  const context = useContext(EnvironmentContext)
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider')
  }
  return context
}
