import { Config, ConfigFeatures } from './Config'

const backendFeaturesToConfigFeatures: Partial<
  Record<keyof ConfigFeatures, string>
> = {
  costsPage: 'tracked-txs.l2costs',
  liveness: 'tracked-txs.liveness',
  zkCatalog: 'verifiers',
  implementationChange: 'implementationChangeReporter',
  tvlBreakdown: 'tvl',
}

export function getCommonFeatures(
  features: ConfigFeatures,
  backendFeatures: { [key: string]: boolean },
) {
  return Object.fromEntries(
    Object.entries(features).map(([key, value]) => {
      const backendKey =
        backendFeaturesToConfigFeatures[key as keyof ConfigFeatures] ?? key

      if (backendKey.includes('.')) {
        const [parentFeature] = backendKey.split('.')
        if (!backendFeatures[parentFeature]) return [key, false]
      }

      return [
        key,
        value &&
          (!(backendKey in backendFeatures) || backendFeatures[backendKey]),
      ]
    }),
  ) as Config['features']
}
