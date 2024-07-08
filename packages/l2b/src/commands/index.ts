import { CompareOpStacks } from './CompareOpStacks'
import { DeploymentTimestamp } from './DeploymentTimestamp'

export function getSubcommands() {
  return [DeploymentTimestamp, CompareOpStacks]
}
