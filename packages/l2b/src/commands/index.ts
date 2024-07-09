import { CompareFlatSources } from './CompareFlatSources'
import { CompareOpStacks } from './CompareOpStacks'
import { CompareOrbitStacks } from './CompareOrbitStacks'
import { DeploymentTimestamp } from './DeploymentTimestamp'
import { Flatten } from './Flatten'
import { Powerdiff } from './Powerdiff'
import { TVL } from './TVL'

export function getSubcommands() {
  return [
    DeploymentTimestamp,
    CompareOpStacks,
    CompareOrbitStacks,
    CompareFlatSources,
    Powerdiff,
    Flatten,
    TVL,
  ]
}
