import { ContractValue } from './Discovery'
import { EthereumAddress } from './EthereumAddress'

export function get$Implementations(
  values: Record<string, ContractValue | undefined> | undefined,
): EthereumAddress[] {
  return toAddressArray(values?.$implementation)
}

export function get$Admins(
  values: Record<string, ContractValue | undefined> | undefined,
): EthereumAddress[] {
  return toAddressArray(values?.$admin)
}

function toAddressArray(value: ContractValue | undefined) {
  if (typeof value === 'string') {
    return [value as unknown as EthereumAddress]
  }
  if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
    return value.map((v) => v as unknown as EthereumAddress)
  }
  return []
}
