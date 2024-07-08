import { CompareFlatSources } from './CompareFlatSources'
import { CompareOpStacks } from './CompareOpStacks'
import { CompareOrbitStacks } from './CompareOrbitStacks'
import { DeploymentTimestamp } from './DeploymentTimestamp'

export function getSubcommands() {
  return [
    DeploymentTimestamp,
    CompareOpStacks,
    CompareOrbitStacks,
    CompareFlatSources,
  ]
}
