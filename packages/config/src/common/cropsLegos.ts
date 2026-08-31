/**
 * An OSI-approved open source license, as listed on
 * https://opensource.org/licenses.
 */
export interface OsiLicense {
  /** SPDX identifier. */
  spdxId: string
  name: string
  /** The license page on opensource.org. */
  url: string
}

/**
 * Only licenses approved by the OSI (https://opensource.org/licenses) belong
 * in this object. The Open source crop may only be green when the project's
 * license comes from here - a license we cannot find on the OSI list is not
 * added, however permissive it looks.
 */
export const OSI_LICENSES = {
  APACHE_2_0: {
    spdxId: 'Apache-2.0',
    name: 'Apache License 2.0',
    url: 'https://opensource.org/license/apache-2-0',
  },
  GPL_2_0: {
    spdxId: 'GPL-2.0',
    name: 'GNU General Public License version 2',
    url: 'https://opensource.org/license/gpl-2-0',
  },
  GPL_3_0: {
    spdxId: 'GPL-3.0',
    name: 'GNU General Public License version 3',
    url: 'https://opensource.org/license/gpl-3-0',
  },
  MIT: {
    spdxId: 'MIT',
    name: 'MIT License',
    url: 'https://opensource.org/license/mit',
  },
} as const satisfies Record<string, OsiLicense>

/**
 * Shared CROPS wording. Reuse these instead of re-writing the same snippet in
 * every project, so identical claims read identically everywhere.
 */
export const CROPS_LEGOS = {
  /** The license claim behind a green Open source crop. */
  osiLicensed: (license: OsiLicense) =>
    `${license.spdxId} licensed (OSI approved), so the right to run, modify and fork is granted.`,
  passesWalkawayTest: (detail?: string) =>
    detail
      ? `Passes the walkaway test: ${detail}`
      : 'Passes the walkaway test.',
  infiniteExitWindow:
    'The core contracts are immutable, cannot be paused, and have no upgrade path, so the exit window is infinite.',
  notReviewed: {
    circuitBreakers: 'Circuit breakers and rate limits.',
    quantumSafety: 'Quantum safety.',
  },
}
