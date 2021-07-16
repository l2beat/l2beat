export interface Project {
  /** Name of the project, will be used as a display name on the website */
  name: string
  /** Url friendly project name, will be used in website urls */
  slug: string
  /** List of the contract in which L1 funds are locked */
  bridges: BridgeDescription[]
  /** Information displayed about the project on the frontend */
  details: ProjectDetails
}

/** A bridge is a contract that allows locking L1 funds to manipulate them on L2. */
export interface BridgeDescription {
  /** Address of the bridge. Use etherscan to verify its correctness. */
  address: string
  /** Block number of the deployment transaction of the bridge contract. */
  sinceBlock: number
  /** List of token tickers (e.g. ETH, DAI) to track. */
  tokens: string[]
}

export interface ProjectDetails {
  /** If the project is not an L2, e.g. plasma, sidechain, etc. */
  showNotL2Warning?: true
  /**
   * Project website. It should be a marketing landing page where users are able
   * to read about the project. Direct links to DApps are also allowed.
   */
  website: string
  /** Theme color of your project. Used as a background color for stats */
  color: string
  /** Description of the technology */
  technology: {
    /** E.g. zk-rollup, payment-channels */
    name: string
    /** Specific details e.g. ZK-SNARKS */
    details?: string
  }
  /** A short (<20 characters) description of the use case */
  purpose: string
  /** Project research results */
  parameters: ProjectParameter[]
  /** Links to recent developments */
  news?: News[]
  /** Additional notes */
  notes?: {
    /** Note text */
    text: string
    /** Relevant links */
    pointers?: string[]
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
  pointers?: string[]
}

export interface News {
  /** Article title */
  name: string
  /** Article link, preferably https */
  link: string
}
