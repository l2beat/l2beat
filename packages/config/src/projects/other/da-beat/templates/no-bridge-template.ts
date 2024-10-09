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
  otherConsiderations: NoDaBridge['otherConsiderations']
}>

type TemplateVars = Optionals & TemplateSpecific

export function NO_BRIDGE(template: TemplateVars): NoDaBridge {
  const id = 'no-bridge'
  const type = 'NoBridge'
  const description =
    template.description ??
    'This project does not have a DA bridge on Ethereum.'

  const technology = template.technology ?? 'There is no DA bridge on Ethereum.'

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
    redWarning:
      'Without a DA bridge, Ethereum has no proof of data availability for this project.',
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
    otherConsiderations: template.otherConsiderations,
  }
}
