// Consumers read projects through ProjectService, from the db.sqlite that
// build.ts writes. Export only types and small static data here: nothing that
// loads project code (index.test.ts checks), and no logic over project data.
// Put derived data on the project at build time instead.

export {
  CROP_ATTESTATION_SOURCE,
  type CropAttestationSource,
  type CropsAttestationsMeta,
  getCropsAttestationsMeta,
} from './crops/attestations'
export { OSI_LICENSES } from './crops/osiLicenses'
export { PROJECT_COUNTDOWNS } from './global/countdowns'
export {
  INTEROP_CHAINS,
  INTEROP_ONE_SIDED_CHAINS,
  type InteropChain,
} from './global/interopChains'
export { HOMEPAGE_MILESTONES } from './global/milestones'
export { type Project, ProjectService } from './ProjectService'
export type * from './types'
