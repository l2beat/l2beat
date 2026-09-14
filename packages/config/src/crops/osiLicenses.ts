import { v } from '@l2beat/validate'
import licenses from './osiLicenses.json'

export const OsiLicenseSchema = v.strictObject({
  spdxId: v.string(),
  name: v.string(),
  url: v.string(),
  categories: v
    .array(v.string())
    .meta({ description: "The OSI's own filing, e.g. 'superseded'." }),
})

export type OsiLicense = v.infer<typeof OsiLicenseSchema>

/**
 * Every OSI-approved license, keyed by SPDX id, pulled from
 * https://opensource.org/licenses by `pnpm --filter @l2beat/config crops:generate-licenses`.
 * This is the whole definition of "open source" a CROPS review uses: a
 * project's `license` must name a key here.
 */
export const OSI_LICENSES = licenses satisfies Record<string, OsiLicense>

export type OsiLicenseId = keyof typeof OSI_LICENSES
