import type { NavSectionCounts } from '~/components/nav/types'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { HomeProjectCounts } from './getHomeProjectCounts'

/**
 * Turns the home project counts into side nav badges. Values stay as short as
 * possible - the spelled out `label` carries the units for tooltips and screen
 * readers instead.
 */
export function getNavSectionCounts(
  counts: HomeProjectCounts,
): NavSectionCounts {
  return {
    scaling: {
      value: formatInteger(counts.scaling),
      label: `${formatInteger(counts.scaling)} projects`,
    },
    interop: {
      value: formatInteger(counts.interopProtocols),
      label: `${formatInteger(counts.interopProtocols)} protocols`,
    },
    privacy: {
      value: formatInteger(counts.privacy),
      label: `${formatInteger(counts.privacy)} projects`,
    },
    'data-availability': {
      value: formatInteger(counts.dataAvailability),
      label: `${formatInteger(counts.dataAvailability)} projects`,
    },
    'zk-catalog': {
      value: formatInteger(counts.zkCatalog),
      label: `${formatInteger(counts.zkCatalog)} projects`,
    },
    ecosystems: {
      value: formatInteger(counts.ecosystems),
      label: `${formatInteger(counts.ecosystems)} ecosystems`,
    },
  }
}
