import { Feature, FeatureType, Risk } from './types'

interface RiskOption {
  type: 'risk'
  value: Risk
}

interface RequirementOption {
  type: 'requirement'
  value: FeatureType
}

type Option = RiskOption | RequirementOption

export function feature(
  name: string,
  description: string,
  ...options: Option[]
): Feature {
  return {
    name,
    description,
    risks: options
      .filter((x): x is RiskOption => x.type === 'risk')
      .map((x) => x.value),
    requirements: options
      .filter((x): x is RequirementOption => x.type === 'requirement')
      .map((x) => x.value),
  }
}

export function risk(type: Risk['type'], description: string): RiskOption {
  return { type: 'risk', value: { type, description } }
}

export function needs(value: FeatureType): RequirementOption {
  return { type: 'requirement', value }
}
