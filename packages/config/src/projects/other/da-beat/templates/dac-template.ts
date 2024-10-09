import { merge } from 'lodash'
import { Layer2 } from '../../../layer2s'
import { Layer3 } from '../../../layer3s'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaEconomicSecurityRisk,
  DaExitWindowRisk,
  DaFraudDetectionRisk,
  DacBridge,
  DacDaLayer,
} from '../types'
import { DaLinks } from '../types/DaLinks'
import { toUsedInProject } from '../utils/to-used-in-project'

type TemplateSpecific = {
  /** Project DAC is associated with */
  project: Layer2 | Layer3
}

type Optionals = {
  /** Overwrite some of the risks, check defaults below */
  risks?: Partial<DacDaLayer['risks'] & DacBridge['risks']>
  /** Links for given DAC, defaults to Project's main links */
  links?: Partial<DaLinks>
  /** Optional layer description and technology, defaults to generic ones. Other considerations will be passed through. */
  layer?: {
    technology?: DacDaLayer['technology']
    description?: DacDaLayer['display']['description']
    otherConsiderations?: DacDaLayer['otherConsiderations']
  }
  /**
   * Optional layer description and technology, defaults to generic ones
   */
  bridge: {
    technology?: DacBridge['technology']
    description?: DacBridge['display']['description']
  } & Pick<
    DacBridge,
    | 'chain'
    | 'totalMembers'
    | 'requiredMembers'
    | 'permissions'
    | 'contracts'
    | 'members'
    | 'transactionDataType'
    | 'isUnderReview'
    | 'otherConsiderations'
  >
  /** Optional warning, defaults to undefined */
  warning?: DacBridge['display']['warning']
  /** Optional red warning, defaults to undefined */
  redWarning?: DacBridge['display']['redWarning']
}

type TemplateVars = Optionals & TemplateSpecific

/**
 * Template function for DA-BEAT DACs.
 * Coverts basic information into expected by DA-BEAT shape
 * creating DA-LAYER and DA-BRIDGE without the need to manually
 * duplicate code and files.
 */
export function DAC(template: TemplateVars): DacDaLayer {
  // Common
  const name = `${template.project.display.name} DAC`
  const usedIn = toUsedInProject([template.project])
  const links = merge(template.project.display.links, template.links)

  // "Bridge" backfill for DAC
  const bridgeDescription =
    template.bridge?.description ??
    `${template.project.display.name} DAC on Ethereum.`

  const bridgeTechnology =
    template.bridge.technology ??
    `## Simple DA Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
    The bridge requires a ${template.bridge.requiredMembers}/${template.bridge.totalMembers} threshold of signatures to be met before the data commitment is accepted.
  `

  const bridgeDisplay: DacBridge['display'] = {
    name,
    slug: 'dac',
    description: bridgeDescription,
    warning: template.warning,
    redWarning: template.redWarning,
    links,
  }

  const dacBridge: DacBridge = {
    id: `${template.project.display.slug}-dac-bridge`,
    type: 'DAC',
    usedIn,
    ...template.bridge,
    display: bridgeDisplay,
    technology: bridgeTechnology,
    risks: {
      attestations:
        template.risks?.attestations ?? DaAttestationSecurityRisk.NotVerified,
      exitWindow: template.risks?.exitWindow ?? DaExitWindowRisk.Immutable,
      accessibility:
        template.risks?.accessibility ?? DaAccessibilityRisk.NotEnshrined,
    },
    otherConsiderations: template.bridge.otherConsiderations,
  }

  // DAC "DA-Layer"
  const layerDescription =
    template.layer?.description ??
    'Set of parties responsible for signing and attesting to the availability of data.'

  const layerTechnology =
    template.layer?.technology ??
    `## Simple Committee
  The Data Availability Committee (DAC) is a set of trusted parties responsible for storing data off-chain and serving it upon demand. 
  The security guarantees of DACs depend on the specific setup and can vary significantly based on the criteria for selecting committee members, 
  their operational transparency, and the mechanisms in place to handle disputes and failures.
  `

  const layerDisplay: DacDaLayer['display'] = {
    name,
    slug: template.project.display.slug,
    description: layerDescription,
    links,
  }

  const dacLayer: DacDaLayer = {
    id: `${template.project.display.slug}-dac-layer`,
    kind: 'DAC',
    type: 'DaLayer',
    display: layerDisplay,
    technology: layerTechnology,
    usedIn,
    bridges: [dacBridge],
    risks: {
      economicSecurity:
        template.risks?.economicSecurity ?? DaEconomicSecurityRisk.Unknown,
      fraudDetection:
        template.risks?.fraudDetection ?? DaFraudDetectionRisk.NoFraudDetection,
    },
    otherConsiderations: template.layer?.otherConsiderations,
  }

  return dacLayer
}
