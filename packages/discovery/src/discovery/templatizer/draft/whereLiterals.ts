/**
 * Whether a `where` literal can ever equal the log value it is compared to.
 *
 * V1 decodes each log, chain-prefixes every address-like string with
 * `prefixAddresses` and compares with strict equality. So a literal that
 * type-checks can still never match: a raw or lowercase address, uppercase
 * hex, or a number written as a string. The fix is mechanical, so the
 * problem names the literal that would match, computed by rendering the
 * literal as the log value would be rendered and running V1's own
 * `prefixAddresses` over it.
 */
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { ContractValue } from '../../output/types'
import { prefixAddresses } from '../../utils/prefixAddresses'
import { checkLiteral } from '../abi/literals'

export function whereLiteralProblem(
  literal: string | number | boolean,
  param: utils.ParamType,
  chain: string,
): string | undefined {
  if (param.baseType === 'array' || param.baseType === 'tuple') {
    return `"=" and "!=" compare with strict equality, which never holds for a ${param.format()} value; compare a scalar argument instead`
  }
  if (param.indexed && (param.type === 'string' || param.type === 'bytes')) {
    return `an indexed ${param.type} is logged only as its hash, so V1 cannot compare it with a literal`
  }
  const typeProblem = checkLiteral(literal, param)
  if (typeProblem !== undefined) {
    return typeProblem
  }
  const expected = prefixAddresses(chain, asLogValue(literal, param))
  if (expected === literal) {
    return undefined
  }
  return `V1 compares with the log value exactly as it renders it (${renderingRule(param)}), so write ${JSON.stringify(expected)}`
}

/** The literal as ethers and `toContractValue` would hand the log value to blip. */
function asLogValue(
  literal: string | number | boolean,
  param: utils.ParamType,
): ContractValue {
  if (param.type === 'address') {
    return utils.getAddress(rawAddress(literal as string).toLowerCase())
  }
  if (/^bytes\d*$/.test(param.type)) {
    return (literal as string).toLowerCase()
  }
  if (/^u?int\d*$/.test(param.type)) {
    const value = BigInt(literal as string | number)
    const safe = BigInt(Number.MAX_SAFE_INTEGER)
    return value <= safe && value >= -safe ? Number(value) : value.toString()
  }
  return literal
}

function rawAddress(value: string): string {
  return ChainSpecificAddress.check(value)
    ? ChainSpecificAddress.address(value).toString()
    : value
}

function renderingRule(param: utils.ParamType): string {
  if (param.type === 'address') {
    return 'addresses chain-prefixed and checksummed'
  }
  if (/^bytes\d*$/.test(param.type)) {
    return 'hex in lowercase'
  }
  if (/^u?int\d*$/.test(param.type)) {
    return 'integers up to 2^53 as numbers, larger ones as decimal strings'
  }
  return 'strings that look like addresses are chain-prefixed'
}
