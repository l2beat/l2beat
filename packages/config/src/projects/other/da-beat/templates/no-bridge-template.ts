import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaBridgeRisks,
  DaExitWindowRisk,
  NoDaBridge,
} from '../types'
import { DaLinks } from '../types/DaLinks'
import { linkByDA } from '../utils/link-by-da'

type TemplateSpecific = {
  /** DA layer name to automatically match projects with */
  layer: string
}

type Optionals = Partial<{
  links: Partial<DaLinks>
  risks: Partial<NoDaBridge['risks']>
  usedIn: NoDaBridge['usedIn']
  warnings: NoDaBridge['display']['warning']
  redWarnings: NoDaBridge['display']['redWarning']
  description: NoDaBridge['display']['description']
  technology: NoDaBridge['technology']
}>

type TemplateVars = Optionals & TemplateSpecific

export function NO_BRIDGE(template: TemplateVars): NoDaBridge {
  const id = 'no-bridge'
  const type = 'NoBridge'
  const description =
    template.description ??
    'No bridge dolore occaecat excepteur consectetur sit excepteur et. Laborum ullamco occaecat irure consequat labore tempor sint sit est. Elit laborum incididunt reprehenderit voluptate exercitation cupidatat cupidatat sunt. Dolore fugiat ullamco ipsum ex aute eu incididunt ullamco.'

  const technology =
    template.technology ??
    'Some note about the technology used by the data availability layer.\n## Markdown supported'

  const usedIn =
    template.usedIn ??
    linkByDA({
      layer: (layer) => layer === template.layer,
      bridge: (bridge) => bridge === 'None',
    })

  const display = {
    name: 'No bridge',
    slug: `no-bridge`,
    description,
    links: {
      websites: [],
      documentation: [],
      repositories: [],
      apps: [],
      explorers: [],
      socialMedia: [],
      ...template.links,
    },
  }

  const risks = {
    accessibility: DaAccessibilityRisk.NotEnshrined,
    attestations: DaAttestationSecurityRisk.NoBridge,
    exitWindow: DaExitWindowRisk.NoBridge,
    ...template.risks,
  } satisfies DaBridgeRisks

  return {
    id,
    type,
    display,
    risks,
    technology,
    usedIn,
  }
}
