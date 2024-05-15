import { ResolvedFeatureFlag } from '../../config/FeatureFlags'

export class FeaturesController {
  constructor(private readonly flags?: ResolvedFeatureFlag[]) {}

  getRecord() {
    return this.flags?.reduce(
      (acc, flag) => {
        acc[flag.feature] = flag.enabled
        return acc
      },
      {} as Record<string, boolean>,
    )
  }
}
