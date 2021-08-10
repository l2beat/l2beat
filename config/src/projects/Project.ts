export interface Project {
  /** Name of the project, will be used as a display name on the website */
  name: string
  /** Url friendly project name, will be used in website urls */
  slug: string
  /** Symbol of the token associated with this project */
  associatedToken?: string
  /** List of the contract in which L1 funds are locked */
  bridges: ProjectBridge[]
  /** Information displayed about the project on the frontend */
  details: ProjectDetails
}

/** A bridge is a contract that allows locking L1 funds to manipulate them on L2. */
export interface ProjectBridge {
  /** Address of the bridge. Use etherscan to verify its correctness. */
  address: string
  /** Block number of the deployment transaction of the bridge contract. */
  sinceBlock: number
  /** List of token tickers (e.g. ETH, DAI) to track. */
  tokens: string[]
}

export interface ProjectDetails {
  /** A warning displayed at the top of the project page */
  warning?: string
  /** List of links */
  links: ProjectLinks
  /** A short (<20 characters) description of the use case */
  purpose: string
  // TODO: Not optional
  /** A few sentences describing the project the project */
  description?: string
  // TODO: Not optional
  /** Deep dive into project technology */
  technology?: ProjectTechnology
  /** Links to recent developments */
  news?: News[]

  // DEPRECATED ITEMS BELOW

  /** @deprecated E.g. "ZK Rollup", "Payment Channels" */
  technologyName: string
  /** @deprecated Specific details e.g. ZK-SNARKS */
  technologyDetails?: string
  /** @deprecated Project research results */
  parameters: ProjectParameter[]
  /** @deprecated Additional notes */
  notes?: {
    /** Note text */
    text: string
    /** Relevant links */
    pointers?: Pointer[]
  }
}

/** List of links relevant to the project */
export interface ProjectLinks {
  /** Links to marketing landing pages. */
  websites: string[]
  /** Links to webapps connected to the project. */
  apps: string[]
  /** Links to documentation pages. */
  documentation: string[]
  /** Links to transaction explorers. */
  explorers: string[]
  /** Links to source code repositories. */
  repositories: string[]
  /** Links to social media pages. */
  socialMedia: string[]
}

/** A detailed overview of the technology used in the project */
export interface ProjectTechnology {
  category: {
    /** Name of the category the project belongs to */
    name: ProjectCategory
    /** Additional details about the technology */
    description?: string
    /** List of references backing up the claim */
    references: ProjectReference[]
  }
  /** What state correctness mechanism is used in the project */
  stateCorrectness: ProjectTechnologyChoice
  /** What is the data availability choice for the project */
  dataAvailability: ProjectTechnologyChoice
  /** What is the new cryptography used in the project */
  newCryptography?: ProjectTechnologyChoice
  /** What is solution to the mass exit problem */
  massExit?: ProjectTechnologyChoice
  /** What is the additional privacy offered */
  additionalPrivacy?: ProjectTechnologyChoice
  /** What are the smart contract capabilities */
  smartContracts?: ProjectTechnologyChoice
  /** What are the details about project operator(s) */
  operator: ProjectTechnologyChoice
  /** What are the details about force transactions (censorship resistance) */
  forceTransactions: ProjectTechnologyChoice
  /** A description of the available exit mechanisms */
  exitMechanisms: ProjectExitMechanism[]
  /** List of smart contracts used in the project */
  contracts: ProjectContracts
}

export type ProjectCategory =
  | 'Optimistic Rollup'
  | 'Plasma'
  | 'State Pools'
  | 'Validium'
  | 'ZK Rollup'

export interface ProjectTechnologyChoice {
  /** Name of the specific technology choice */
  name: string
  /** A short (<20 characters) name of the technology choice */
  shortName: string
  /** Description of the specific technology choice. Null means missing information */
  description: string | null
  /** List of references backing up the claim */
  references: ProjectReference[]
  /** List of risks associated with the technology choice */
  risks: ProjectRisk[]
}

export type ProjectExitMechanism = Omit<ProjectTechnologyChoice, 'shortName'>

export interface ProjectRisk {
  /** Category of this risk */
  category: ProjectRiskCategory
  /** Description of te risk. Should form a sentence with the category */
  text: string
  /** List of references backing up the claim */
  references?: ProjectReference[]
}

export type ProjectRiskCategory =
  | 'Funds can be stolen if'
  | 'Funds can be lost if'
  | 'Funds can be frozen if'
  | 'Users can be censored if'

export interface ProjectContracts {
  /** List of the contracts */
  addresses: ProjectContract[]
  /** List of risks associated with the contracts */
  risks: ProjectRisk[]
}

export interface ProjectContract {
  /** Address of the contract */
  address: string
  /** Solidity name of the contract */
  name: string
  /** Description of the contract's role in the system */
  description?: string
  /** True if there is an upgrade mechanism or the contract can be replaced */
  upgradable: boolean
  /** Delay of the upgrade */
  upgradeDelay?: string
  /** Owner of the contract */
  owner?: {
    /** Address of the owner */
    address: string
    /** Type of the owner */
    type: 'eoa' | 'multisig' | 'governance' | 'other'
  }
}

export interface ProjectParameter {
  /** Parameter name, e.g. Permissionless */
  name: string
  /** Parameter value, e.g. Yes */
  value: string
  /** Additional information available on demand but hidden initially */
  tooltip?: string
  /** Researchers opinion about the parameter */
  sentiment?: 'bad' | 'good' | 'neutral'
  /** Relevant links */
  pointers?: Pointer[]
}

export interface ProjectReference {
  /** Short text describing link contents */
  text: string
  /** URL of the link, preferably https */
  href: string
}

export interface Pointer {
  /** Short text describing link contents */
  name: string
  /** URL of the link, preferably https */
  href: string
}

export interface News {
  /** News date */
  date: string
  /** Article title */
  name: string
  /** Article link, preferably https */
  link: string
}
