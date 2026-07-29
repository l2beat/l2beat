import { writeFileSync } from 'fs'
import {
  generateDaTrackingIdentities,
  getDaTrackingSnapshotPath,
} from '../../src/processing/daTrackingIdentities'
import { getProjects } from '../../src/processing/getProjects'

const snapshot = generateDaTrackingIdentities(getProjects())
writeFileSync(
  getDaTrackingSnapshotPath(),
  `${JSON.stringify(snapshot, null, 2)}\n`,
)
const projectCount = Object.keys(snapshot).length
const idCount = Object.values(snapshot).flat().length
console.log(
  `Wrote ${idCount} DA tracking identities for ${projectCount} projects to daTrackingIdentities.json`,
)
