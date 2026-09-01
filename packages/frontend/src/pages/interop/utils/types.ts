export interface InteropSelection {
  from: string[]
  to: string[]
}

export interface AnchoredInteropSelection extends InteropSelection {
  anchorChain?: string
}
