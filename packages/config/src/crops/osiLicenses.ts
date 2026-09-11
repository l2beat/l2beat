import licenses from './osiLicenses.json'

export interface OsiLicense {
  spdxId: string
  name: string
  url: string
  /** The OSI's own filing, e.g. 'popular-strong-community' or 'superseded'. Context only. */
  categories: readonly string[]
}

/**
 * Every OSI-approved license, keyed by SPDX id, pulled from
 * https://opensource.org/licenses by `pnpm --filter @l2beat/config crops:generate-licenses`.
 * This is the whole definition of "open source" a CROPS review uses: a
 * project's `license` must name a key here.
 */
export const OSI_LICENSES = licenses satisfies Record<string, OsiLicense>

export type OsiLicenseId = keyof typeof OSI_LICENSES

/** Throws rather than render a green Open source crop nothing backs. */
export function getOsiLicense(id: OsiLicenseId): OsiLicense {
  const license: OsiLicense | undefined = OSI_LICENSES[id]
  if (!license) {
    throw new Error(
      `${id} is not an OSI-approved license. Only licenses from https://opensource.org/licenses can back the Open source crop.`,
    )
  }
  return license
}
