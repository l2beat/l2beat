import compact from 'lodash/compact'
import type { ZkCatalogSections } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import {
  insertSectionsBefore,
  withSectionAlias,
} from '~/utils/project/editSections'
import type { PrivacyProjectDetails } from '../getPrivacyProjectDetails'
import type { ProjectPrivacyEntry } from './getPrivacyProjectEntry'
import { linkPrivacySources } from './privacySections'

/**
 * The page of a privacy protocol that is also in the ZK Catalog: the privacy
 * page, with what only the catalog page has.
 *
 * - The catalog's proof system, trusted setups, verifiers and program hashes
 *   go where the privacy page has its own trusted setups, which say less.
 * - The page has one value section: the catalog's Value Secured is the same
 *   value, so links to it land on Value Locked. TODO: decide which to show.
 */
export function addZkCatalogToPrivacyEntry(
  entry: ProjectPrivacyEntry,
  zkCatalog: ZkCatalogSections,
  details: PrivacyProjectDetails,
): ProjectPrivacyEntry {
  const sections = insertSectionsBefore(
    withSectionAlias(entry.sections, 'privacy-tvl', 'tvs'),
    ['trusted-setups', 'updates', 'permissions', 'contracts'],
    compact([
      zkCatalog.proofSystem,
      zkCatalog.trustedSetups,
      zkCatalog.verifiers,
      zkCatalog.programHashes,
    ]),
  ).filter(
    (section) =>
      section.props.id !== 'trusted-setups' ||
      section === zkCatalog.trustedSetups,
  )
  return { ...entry, sections: linkPrivacySources(sections, details) }
}
