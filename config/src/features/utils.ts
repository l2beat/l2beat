import { Feature, Risk } from '../projects'
import { Features } from './features'

export interface FeatureOptions {
  pointers?: string[]
  description?: string
  ignoreDefaultRisks?: true
  risks?: Risk[]
}

export function feature(name: string, description: string, ...risks: Risk[]) {
  return function (options?: FeatureOptions): Feature {
    return {
      name,
      generalDescription: description,
      specificDescription: options?.description,
      risks: options?.ignoreDefaultRisks
        ? options.risks ?? []
        : risks.concat(options?.risks ?? []),
      pointers: options?.pointers ?? [],
    }
  }
}

export function risk(type: Risk['type'], description: string): Risk {
  return { type, description }
}

const groups: Record<string, string> = {}
for (const [feature, options] of Object.entries(Features)) {
  for (const option of Object.values(options)) {
    groups[option().name] = feature
  }
}

export function featuresByComparison(
  technology: Feature[],
  features: Feature[]
) {
  return features.map((feature) => {
    const techFeature = technology.find(
      (f) => groups[f.name] === groups[feature.name]
    )
    if (techFeature && techFeature.name !== feature.name) {
      return { ...feature, overrides: techFeature }
    }
    return feature
  })
}
