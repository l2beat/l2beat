export type SourceTagParams =
  | { type: 'Manual'; details?: never }
  | { type: 'AxelarConfig'; details?: never }
  | { type: 'AxelarGateway'; details?: never }
  | { type: 'CoinGecko'; details?: never }
  | { type: 'Deployment'; details?: never }
  | { type: 'OnChain'; details?: never }
  | { type: 'Orbit'; details?: never }
  | { type: 'TokenList'; details: string }
  | { type: 'Wormhole'; details?: never }

export const sourceTag = (params: SourceTagParams) =>
  `${params.type}${params.details && `-${params.details}`}`
