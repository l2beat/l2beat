import { Feature, Risk } from '../projects'

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
