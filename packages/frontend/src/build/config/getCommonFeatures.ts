import { Config, ConfigFeatures } from './Config'

const backendFeaturesToConfigFeatures: Partial<
  Record<keyof ConfigFeatures, string>
> = {
  implementationChange: 'implementationChangeReporter',
  tvlBreakdown: 'tvl',
  l2costs: 'tracked-txs.l2costs'
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
