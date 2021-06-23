export interface Feature {
  name: string
  description: string
  risks: Risk[]
  requirements: FeatureType[]
}

export interface Risk {
  type:
    | 'Funds can be stolen'
    | 'Funds can be frozen'
    | 'Funds can be lost'
    | 'Censorship'
  description: string
}

export type FeatureType =
  | 'Withdrawal'
  | 'State'
  | 'Settlement'
  | 'Cryptography'
  | 'Data'
  | 'MassExit'
  | 'SourceCode'
  | 'Upgradeability'
  | 'Ownership'
  | 'SmartContracts'
  | 'Sequencer'
  | 'ForceTxs'
  | 'Generality'
