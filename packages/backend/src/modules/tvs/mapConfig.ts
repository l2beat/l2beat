import { Layer2 } from "@l2beat/config";
import { AmountConfig, PriceConfig, TvsConfig } from "./types";

export function mapConfig(_project: Layer2): TvsConfig {
  throw new Error('Not implemented')
}

export function extractPricesAndAmounts(_config: TvsConfig): { prices: PriceConfig[], amounts: AmountConfig[] } {
  throw new Error('Not implemented')
}