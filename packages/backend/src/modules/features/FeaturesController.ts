import { ResolvedFeatureFlag } from '../../config/FeatureFlags'

export class FeaturesController {
  constructor(private readonly flags?: ResolvedFeatureFlag[]) {}

  getRecord() {
    return this.flags?.reduce(
      (acc, flag) => ({ ...acc, [flag.feature]: flag.enabled }),
      {} as Record<string, boolean>,
    )
  }
}
