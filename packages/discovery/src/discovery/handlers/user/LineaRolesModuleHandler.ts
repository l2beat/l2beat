import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type BigNumber, type providers, utils } from 'ethers'
import isEmpty from 'lodash/isEmpty'
import zip from 'lodash/zip'

import type { IProvider } from '../../provider/IProvider'
import { FunctionSelectorDecoder } from '../../utils/FunctionSelectorDecoder'
import type { Handler, HandlerResult } from '../Handler'

export type LineaRolesModuleHandlerDefinition = v.infer<
  typeof LineaRolesModuleHandlerDefinition
>
export const LineaRolesModuleHandlerDefinition = v.strictObject({
  type: v.literal('lineaRolesModule'),
  roleNames: v
    .record(
      v.string().check((v) => /^0x[a-f\d]{64}$/i.test(v)),
      v.string(),
    )
    .optional(),
  ignoreRelative: v.boolean().optional(),
})

const abi = new utils.Interface([
  'event AllowTarget(uint16 role, address targetAddress, uint8 options)',
  'event RevokeTarget(uint16 role, address targetAddress)',
  'event ScopeTarget(uint16 role, address targetAddress)',
  'event ScopeAllowFunction(uint16 role, address targetAddress, bytes4 selector, uint8 options, uint256 resultingScopeConfig)',
  'event ScopeRevokeFunction(uint16 role, address targetAddress, bytes4 selector, uint256 resultingScopeConfig)',
  'event ScopeFunction(uint16 role, address targetAddress, bytes4 functionSig, bool[] isParamScoped, uint8[] paramType, uint8[] paramComp, bytes[] compValue, uint8 options, uint256 resultingScopeConfig)',
  'event ScopeFunctionExecutionOptions(uint16 role, address targetAddress, bytes4 functionSig, uint8 options, uint256 resultingScopeConfig)',
  'event ScopeParameter(uint16 role, address targetAddress, bytes4 functionSig, uint256 index, uint8 paramType, uint8 paramComp, bytes compValue, uint256 resultingScopeConfig)',
  'event ScopeParameterAsOneOf(uint16 role, address targetAddress, bytes4 functionSig, uint256 index, uint8 paramType, bytes[] compValues, uint256 resultingScopeConfig)',
  'event UnscopeParameter(uint16 role, address targetAddress, bytes4 functionSig, uint256 index, uint256 resultingScopeConfig)',
  'event AssignRoles(address module, uint16[] roles, bool[] memberOf)',
  'event SetDefaultRole(address module, uint16 defaultRole)',
])

type ExecutionOptions = 'None' | 'Send' | 'DelegateCall' | 'Both'
type ParameterType = 'Static' | 'Dynamic' | 'Dynamic32'
type ComparisonType = 'EqualTo' | 'GreaterThan' | 'LessThan' | 'OneOf'

interface TargetAddress {
  clearance: 'None' | 'Target' | 'Function'
  options: ExecutionOptions
}

interface ParameterConfig {
  isScoped: boolean
  type: ParameterType
  comparisonType: ComparisonType
}

export interface ScopeConfig {
  options: ExecutionOptions
  wildcarded: boolean
  parameters: ParameterConfig[]
}

interface Role {
  members: Record<string, boolean>
  targets: Record<string, TargetAddress>
  functions: Record<string, Record<string, ScopeConfig>>
  compValues: Record<string, string>
  compValuesOneOf: Record<string, string[]>
}

export class LineaRolesModuleHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: LineaRolesModuleHandlerDefinition,
    readonly abi: string[],
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(address, [
      [
        abi.getEventTopic('AllowTarget'),
        abi.getEventTopic('RevokeTarget'),
        abi.getEventTopic('ScopeTarget'),
        abi.getEventTopic('ScopeAllowFunction'),
        abi.getEventTopic('ScopeRevokeFunction'),
        abi.getEventTopic('ScopeFunction'),
        abi.getEventTopic('ScopeFunctionExecutionOptions'),
        abi.getEventTopic('ScopeParameter'),
        abi.getEventTopic('ScopeParameterAsOneOf'),
        abi.getEventTopic('UnscopeParameter'),
        abi.getEventTopic('AssignRoles'),
        abi.getEventTopic('SetDefaultRole'),
      ],
    ])
    const events = logs.map((l) => parseRoleLog(provider.chain, l))
    const roles: Record<number, Role> = {}
    const defaultRoles: Record<string, number> = {}

    const targets = [
      ...new Set(
        events
          .map((e) => {
            if ('targetAddress' in e) {
              return e.targetAddress
            }
            return undefined
          })
          .filter(notUndefined),
      ),
    ]

    const decoder = new FunctionSelectorDecoder(provider)
    await decoder.fetchTargets(targets)

    for (const event of events) {
      if (event.type === 'AssignRoles') {
        zip(event.roles, event.memberOf).forEach(([roleId, memberOf]) => {
          assert(roleId !== undefined && memberOf !== undefined)
          roles[roleId] ??= {
            members: {},
            targets: {},
            functions: {},
            compValues: {},
            compValuesOneOf: {},
          }
          const role = roles[roleId]
          assert(role !== undefined)
          role.members[event.module.toString()] = memberOf
          if (!memberOf) {
            delete role.members[event.module.toString()]
            deleteRoleIfEmpty(roles, roleId)
          }
        })
        continue
      }

      if (event.type === 'SetDefaultRole') {
        defaultRoles[event.module.toString()] = event.defaultRole
        continue
      }

      roles[event.role] ??= {
        members: {},
        targets: {},
        functions: {},
        compValues: {},
        compValuesOneOf: {},
      }

      const role = roles[event.role]
      assert(role !== undefined)

      switch (event.type) {
        case 'AllowTarget': {
          role.targets[event.targetAddress.toString()] = {
            clearance: 'Target',
            options: event.execOption,
          }
          break
        }
        case 'RevokeTarget': {
          delete role.targets[event.targetAddress.toString()]
          deleteRoleIfEmpty(roles, event.role)
          break
        }
        case 'ScopeTarget': {
          role.targets[event.targetAddress.toString()] = {
            clearance: 'Function',
            options: 'None',
          }
          break
        }
        case 'ScopeAllowFunction':
        case 'ScopeFunctionExecutionOptions': {
          const func = getFunction(role, event)
          func[
            await decoder.decodeSelector(event.targetAddress, event.functionSig)
          ] = decodeScopeConfig(event.resultingScopeConfig)
          break
        }
        case 'UnscopeParameter': {
          const func = getFunction(role, event)
          const compKey = compValueKey(
            event,
            await decoder.decodeSelector(
              event.targetAddress,
              event.functionSig,
            ),
            event.index,
          )
          delete role.compValues[compKey]
          delete role.compValuesOneOf[compKey]
          func[
            await decoder.decodeSelector(event.targetAddress, event.functionSig)
          ] = decodeScopeConfig(event.resultingScopeConfig)
          break
        }
        case 'ScopeRevokeFunction': {
          delete role.functions[event.targetAddress.toString()]
          deleteRoleIfEmpty(roles, event.role)
          break
        }
        case 'ScopeFunction': {
          const func = getFunction(role, event)
          const selector = await decoder.decodeSelector(
            event.targetAddress,
            event.functionSig,
          )
          func[selector] = decodeScopeConfig(event.resultingScopeConfig)

          event.compValue.forEach((compValue, i) => {
            const compKey = compValueKey(event, selector, i)

            delete role.compValuesOneOf[compKey]
            role.compValues[compKey] = compValue
          })
          break
        }
        case 'ScopeParameter': {
          const func = getFunction(role, event)
          const selector = await decoder.decodeSelector(
            event.targetAddress,
            event.functionSig,
          )
          const compKey = compValueKey(event, selector, event.index)
          func[selector] = decodeScopeConfig(event.resultingScopeConfig)
          delete role.compValuesOneOf[compKey]
          role.compValues[compKey] = event.compValue
          break
        }
        case 'ScopeParameterAsOneOf': {
          const func = getFunction(role, event)
          const selector = await decoder.decodeSelector(
            event.targetAddress,
            event.functionSig,
          )
          const compKey = compValueKey(event, selector, event.index)
          func[selector] = decodeScopeConfig(event.resultingScopeConfig)
          delete role.compValues[compKey]
          role.compValuesOneOf[compKey] = event.compValues
          break
        }
        default: {
          break
        }
      }
    }

    return {
      field: this.field,
      value: {
        defaultRoles,
        roles: Object.fromEntries(
          Object.entries(roles).map(([key, role]) => [
            key,
            {
              members: role.members,
              targets: Object.fromEntries(
                Object.entries(role.targets).map(([addr, opt]) => [
                  addr,
                  { ...opt },
                ]),
              ),
              functions: Object.fromEntries(
                Object.entries(role.functions).map(([addr, config]) => [
                  addr,
                  Object.fromEntries(
                    Object.entries(config).map(([selector, scopeConfig]) => [
                      selector,
                      Object.fromEntries(Object.entries(scopeConfig)),
                    ]),
                  ),
                ]),
              ),
              compValues: role.compValues,
              compValuesOneOf: role.compValuesOneOf,
            },
          ]),
        ),
      },
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}

function deleteRoleIfEmpty(roles: Record<number, Role>, roleId: number): void {
  const role = roles[roleId]
  if (role === undefined) {
    return
  }

  if (Object.keys(role).every((k) => isEmpty(role[k as keyof Role]))) {
    delete roles[roleId]
  }
}

function decodeScopeConfig(configStr: string): ScopeConfig {
  const config = BigInt(configStr)
  const leftSide = config >> 240n
  const options = (leftSide & 0xc000n) >> 14n
  const isWildcarded = (leftSide & 0x2000n) >> 13n
  const length = leftSide & 0xffn

  const parameters: ParameterConfig[] = new Array(Number(length))
    .fill(0)
    .map((_, i) => ({
      isScoped: maskOffIsScoped(config, i) !== 0,
      type: decodeParameterType(maskOffParameterType(config, i)),
      comparisonType: decodeComparisonType(maskOffComparisonType(config, i)),
    }))

  return {
    options: decodeExecOptions(Number(options)),
    wildcarded: isWildcarded !== 0n,
    parameters,
  }
}

function maskOffIsScoped(config: bigint, index: number): number {
  return Number(
    ((1n << (BigInt(index) + 192n)) & config) >> (192n + BigInt(index)),
  )
}

function maskOffParameterType(config: bigint, index: number): number {
  return Number(
    ((3n << (BigInt(index) * 2n + 96n)) & config) >> (96n + BigInt(index) * 2n),
  )
}

function maskOffComparisonType(config: bigint, index: number): number {
  return Number(((3n << (BigInt(index) * 2n)) & config) >> (BigInt(index) * 2n))
}

function getFunction(
  role: Role,
  arg: Pick<ScopeAllowFunctionLog, 'targetAddress'>,
): Record<string, ScopeConfig> {
  role.functions[arg.targetAddress.toString()] ??= {}
  const func = role.functions[arg.targetAddress.toString()]
  assert(func !== undefined)
  return func
}

function compValueKey(
  arg: Pick<ScopeAllowFunctionLog, 'targetAddress'>,
  decodedSelector: string,
  index: number,
): string {
  return `${arg.targetAddress.toString()}:${decodedSelector}:${index}`
}

function decodeExecOptions(value: number): TargetAddress['options'] {
  const lookup: Record<number, TargetAddress['options']> = {
    0: 'None',
    1: 'Send',
    2: 'DelegateCall',
    3: 'Both',
  }

  const result = lookup[value]
  assert(result !== undefined, 'Invalid execOption value')
  return result
}

function decodeParameterType(value: number): ParameterType {
  const lookup: Record<number, ParameterType> = {
    0: 'Static',
    1: 'Dynamic',
    2: 'Dynamic32',
  }

  const result = lookup[value]
  assert(result !== undefined, 'Invalid parameterType value')
  return result
}

function decodeComparisonType(value: number): ComparisonType {
  const lookup: Record<number, ComparisonType> = {
    0: 'EqualTo',
    1: 'GreaterThan',
    2: 'LessThan',
    3: 'OneOf',
  }

  const result = lookup[value]
  assert(result !== undefined, 'Invalid comparisontype value')
  return result
}

interface AllowTargetLog {
  readonly type: 'AllowTarget'
  readonly role: number
  readonly targetAddress: ChainSpecificAddress
  readonly execOption: TargetAddress['options']
}

interface RevokeTargetLog {
  readonly type: 'RevokeTarget'
  readonly role: number
  readonly targetAddress: ChainSpecificAddress
}

interface ScopeTargetLog {
  readonly type: 'ScopeTarget'
  readonly role: number
  readonly targetAddress: ChainSpecificAddress
}

interface ScopeAllowFunctionLog {
  readonly type: 'ScopeAllowFunction'
  readonly role: number
  readonly targetAddress: ChainSpecificAddress
  readonly functionSig: string
  readonly options: number
  readonly resultingScopeConfig: string
}

interface ScopeRevokeFunctionLog {
  readonly type: 'ScopeRevokeFunction'
  readonly role: number
  readonly targetAddress: ChainSpecificAddress
  readonly functionSig: string
  readonly resultingScopeConfig: string
}

interface ScopeFunctionLog {
  readonly type: 'ScopeFunction'
  readonly role: number
  readonly targetAddress: ChainSpecificAddress
  readonly functionSig: string
  readonly isParamScoped: boolean[]
  readonly paramType: number[]
  readonly paramComp: number[]
  readonly compValue: string[]
  readonly options: number
  readonly resultingScopeConfig: string
}

interface ScopeFunctionExecutionOptionsLog {
  readonly type: 'ScopeFunctionExecutionOptions'
  readonly role: number
  readonly targetAddress: ChainSpecificAddress
  readonly functionSig: string
  readonly options: number
  readonly resultingScopeConfig: string
}

interface ScopeParameterLog {
  readonly type: 'ScopeParameter'
  readonly role: number
  readonly targetAddress: ChainSpecificAddress
  readonly functionSig: string
  readonly index: number
  readonly paramType: number
  readonly paramComp: number
  readonly compValue: string
  readonly resultingScopeConfig: string
}

interface ScopeParameterAsOneOfLog {
  readonly type: 'ScopeParameterAsOneOf'
  readonly role: number
  readonly targetAddress: ChainSpecificAddress
  readonly functionSig: string
  readonly index: number
  readonly paramType: number
  readonly compValues: string[]
  readonly resultingScopeConfig: string
}

interface UnscopeParameterLog {
  readonly type: 'UnscopeParameter'
  readonly role: number
  readonly targetAddress: ChainSpecificAddress
  readonly functionSig: string
  readonly index: number
  readonly resultingScopeConfig: string
}

interface AssignRolesLog {
  readonly type: 'AssignRoles'
  readonly module: ChainSpecificAddress
  readonly roles: number[]
  readonly memberOf: boolean[]
}

interface SetDefaultRoleLog {
  readonly type: 'SetDefaultRole'
  readonly module: ChainSpecificAddress
  readonly defaultRole: number
}

function parseRoleLog(
  longChain: string,
  log: providers.Log,
):
  | AllowTargetLog
  | RevokeTargetLog
  | ScopeTargetLog
  | ScopeAllowFunctionLog
  | ScopeRevokeFunctionLog
  | ScopeFunctionLog
  | ScopeFunctionExecutionOptionsLog
  | ScopeParameterLog
  | ScopeParameterAsOneOfLog
  | UnscopeParameterLog
  | AssignRolesLog
  | SetDefaultRoleLog {
  const event = abi.parseLog(log)
  if (event.name === 'AllowTarget') {
    return {
      type: event.name,
      role: event.args.role as number,
      targetAddress: ChainSpecificAddress.fromLong(
        longChain,
        event.args.targetAddress as string,
      ),
      execOption: decodeExecOptions(event.args.options as number),
    } as const
  }
  if (event.name === 'RevokeTarget' || event.name === 'ScopeTarget') {
    return {
      type: event.name,
      role: event.args.role as number,
      targetAddress: ChainSpecificAddress.fromLong(
        longChain,
        event.args.targetAddress as string,
      ),
    } as const
  }
  if (event.name === 'ScopeAllowFunction') {
    return {
      type: event.name,
      role: event.args.role as number,
      targetAddress: ChainSpecificAddress.fromLong(
        longChain,
        event.args.targetAddress as string,
      ),
      functionSig: event.args.selector as string,
      options: event.args.options as number,
      resultingScopeConfig: (
        event.args.resultingScopeConfig as BigNumber
      ).toString(),
    } as const
  }
  if (event.name === 'ScopeRevokeFunction') {
    return {
      type: event.name,
      role: event.args.role as number,
      targetAddress: ChainSpecificAddress.fromLong(
        longChain,
        event.args.targetAddress as string,
      ),
      functionSig: event.args.selector as string,
      resultingScopeConfig: (
        event.args.resultingScopeConfig as BigNumber
      ).toString(),
    } as const
  }
  if (event.name === 'ScopeFunction') {
    return {
      type: event.name,
      role: event.args.role as number,
      targetAddress: ChainSpecificAddress.fromLong(
        longChain,
        event.args.targetAddress as string,
      ),
      functionSig: event.args.functionSig as string,
      isParamScoped: event.args.isParamScoped as boolean[],
      paramType: event.args.paramType as number[],
      paramComp: event.args.paramComp as number[],
      compValue: event.args.compValue as string[],
      options: event.args.options as number,
      resultingScopeConfig: (
        event.args.resultingScopeConfig as BigNumber
      ).toString(),
    } as const
  }
  if (event.name === 'ScopeFunctionExecutionOptions') {
    return {
      type: event.name,
      role: event.args.role as number,
      targetAddress: ChainSpecificAddress.fromLong(
        longChain,
        event.args.targetAddress as string,
      ),
      functionSig: event.args.functionSig as string,
      options: event.args.options as number,
      resultingScopeConfig: (
        event.args.resultingScopeConfig as BigNumber
      ).toString(),
    } as const
  }
  if (event.name === 'ScopeParameter') {
    return {
      type: event.name,
      role: event.args.role as number,
      targetAddress: ChainSpecificAddress.fromLong(
        longChain,
        event.args.targetAddress as string,
      ),
      functionSig: event.args.functionSig as string,
      index: event.args.index as number,
      paramType: event.args.paramType as number,
      paramComp: event.args.paramComp as number,
      compValue: event.args.compValue as string,
      resultingScopeConfig: (
        event.args.resultingScopeConfig as BigNumber
      ).toString(),
    } as const
  }
  if (event.name === 'ScopeParameterAsOneOf') {
    return {
      type: event.name,
      role: event.args.role as number,
      targetAddress: ChainSpecificAddress.fromLong(
        longChain,
        event.args.targetAddress as string,
      ),
      functionSig: event.args.functionSig as string,
      index: event.args.index as number,
      paramType: event.args.paramType as number,
      compValues: event.args.compValues as string[],
      resultingScopeConfig: (
        event.args.resultingScopeConfig as BigNumber
      ).toString(),
    } as const
  }
  if (event.name === 'UnscopeParameter') {
    return {
      type: event.name,
      role: event.args.role as number,
      targetAddress: ChainSpecificAddress.fromLong(
        longChain,
        event.args.targetAddress as string,
      ),
      functionSig: event.args.functionSig as string,
      index: event.args.index as number,
      resultingScopeConfig: (
        event.args.resultingScopeConfig as BigNumber
      ).toString(),
    } as const
  }
  if (event.name === 'AssignRoles') {
    return {
      type: event.name,
      module: ChainSpecificAddress.fromLong(
        longChain,
        event.args.module as string,
      ),
      roles: event.args.roles as number[],
      memberOf: event.args.memberOf as boolean[],
    } as const
  }
  if (event.name === 'SetDefaultRole') {
    return {
      type: event.name,
      module: ChainSpecificAddress.fromLong(
        longChain,
        event.args.module as string,
      ),
      defaultRole: event.args.defaultRole as number,
    } as const
  }

  assert(false)
}

function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined
}
