export interface Layer2FinalityConfig {
  type: FinalityType
  lag: number
}

export type FinalityType = 'OPStack' | 'Linea' | 'PolygonZkEVM'
