import { Config, ConfigFeatures } from './Config'

const backendFeaturesToConfigFeatures: Partial<
  Record<keyof ConfigFeatures, string>
> = {
  costsPage: 'tracked-txs.l2costs',
  liveness: 'tracked-txs.liveness',
}

export function getCommonFeatures(
  features: ConfigFeatures,
  backendFeatures: { [key: string]: boolean },
) {
  return Object.fromEntries(
    Object.entries(features).map(([key, value]) => {
      const backendKey =
        backendFeaturesToConfigFeatures[key as keyof ConfigFeatures] ?? key

      return [
        key,
        value &&
          (!(backendKey in backendFeatures) || backendFeatures[backendKey]),
      ]
    }),
  ) as Config['features']
}
