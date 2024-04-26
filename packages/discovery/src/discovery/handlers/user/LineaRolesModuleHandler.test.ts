import { assert } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import { providers, utils } from 'ethers'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { LineaRolesModuleHandler, ScopeConfig } from './LineaRolesModuleHandler'

describe(LineaRolesModuleHandler.name, () => {
  const BLOCK_NUMBER = 1234

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

  function AllowTarget(
    role: number,
    targetAddress: EthereumAddress,
    options: number,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('AllowTarget'), [
      role,
      targetAddress,
      options,
    ]) as providers.Log
  }

  function RevokeTarget(
    role: number,
    targetAddress: EthereumAddress,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('RevokeTarget'), [
      role,
      targetAddress,
    ]) as providers.Log
  }

  function ScopeTarget(
    role: number,
    targetAddress: EthereumAddress,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('ScopeTarget'), [
      role,
      targetAddress,
    ]) as providers.Log
  }

  function ScopeAllowFunction(
    role: number,
    targetAddress: EthereumAddress,
    selector: string,
    options: number,
    scopeConfig: string,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('ScopeAllowFunction'), [
      role,
      targetAddress,
      selector,
      options,
      scopeConfig,
    ]) as providers.Log
  }

  function ScopeRevokeFunction(
    role: number,
    targetAddress: EthereumAddress,
    selector: string,
    resultingScopeConfig: string,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('ScopeRevokeFunction'), [
      role,
      targetAddress,
      selector,
      resultingScopeConfig,
    ]) as providers.Log
  }

  function ScopeFunction(
    role: number,
    targetAddress: EthereumAddress,
    selector: string,
    isParamScoped: boolean[],
    paramType: number[],
    paramComp: number[],
    compValues: string[],
    options: number,
    resultingScopeConfig: string,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('ScopeFunction'), [
      role,
      targetAddress,
      selector,
      isParamScoped,
      paramType,
      paramComp,
      compValues,
      options,
      resultingScopeConfig,
    ]) as providers.Log
  }

  function ScopeFunctionExecutionOptions(
    role: number,
    targetAddress: EthereumAddress,
    selector: string,
    options: number,
    resultingScopeConfig: string,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('ScopeFunctionExecutionOptions'), [
      role,
      targetAddress,
      selector,
      options,
      resultingScopeConfig,
    ]) as providers.Log
  }

  function ScopeParameter(
    role: number,
    targetAddress: EthereumAddress,
    selector: string,
    index: number,
    paramType: number,
    paramComp: number,
    compValue: string,
    resultingScopeConfig: string,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('ScopeParameter'), [
      role,
      targetAddress,
      selector,
      index,
      paramType,
      paramComp,
      compValue,
      resultingScopeConfig,
    ]) as providers.Log
  }

  function ScopeParameterAsOneOf(
    role: number,
    targetAddress: EthereumAddress,
    selector: string,
    index: number,
    paramType: number,
    compValues: string[],
    resultingScopeConfig: string,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('ScopeParameterAsOneOf'), [
      role,
      targetAddress,
      selector,
      index,
      paramType,
      compValues,
      resultingScopeConfig,
    ]) as providers.Log
  }

  function UnscopeParameter(
    role: number,
    targetAddress: EthereumAddress,
    selector: string,
    index: number,
    resultingScopeConfig: string,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('UnscopeParameter'), [
      role,
      targetAddress,
      selector,
      index,
      resultingScopeConfig,
    ]) as providers.Log
  }

  function AssignRoles(
    module: EthereumAddress,
    roles: number[],
    memberOf: boolean[],
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('AssignRoles'), [
      module,
      roles,
      memberOf,
    ]) as providers.Log
  }

  function SetDefaultRole(
    module: EthereumAddress,
    defaultRole: number,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('SetDefaultRole'), [
      module,
      defaultRole,
    ]) as providers.Log
  }

  function getFunctionSelector(functionDecl: string) {
    const iface = new utils.Interface([functionDecl])
    const key = Object.keys(iface.functions)[0]
    assert(key)
    return iface.getSighash(key)
  }

  function packScopeConfig(config: ScopeConfig): string {
    assert(
      config.parameters.length < 256,
      'The length of the parameters array can not be bigger than 255',
    )
    let result = BigInt(0)

    const execLookUp: Record<ScopeConfig['options'], number> = {
      None: 0,
      Send: 1,
      DelegateCall: 2,
      Both: 3,
    }
    const compLookUp: Record<
      ScopeConfig['parameters'][0]['comparisonType'],
      number
    > = {
      EqualTo: 0,
      GreaterThan: 1,
      LessThan: 2,
      OneOf: 3,
    }
    const paramLookUp: Record<ScopeConfig['parameters'][0]['type'], number> = {
      Static: 0,
      Dynamic: 1,
      Dynamic32: 2,
    }

    result |= BigInt(execLookUp[config.options]) << 254n
    result |= BigInt(config.wildcarded ? 1 : 0) << 253n
    result |= BigInt(config.parameters.length) << 240n

    config.parameters.forEach((param, i) => {
      const isScopedMask = 1n << (BigInt(i) + 192n)
      const paramTypeMask = 3n << (BigInt(i) * 2n + 96n)
      const paramCompMask = 3n << (BigInt(i) * 2n)

      if (param.isScoped) {
        result |= isScopedMask
      } else {
        result &= ~isScopedMask
      }

      result &= ~paramTypeMask
      result |= BigInt(paramLookUp[param.type]) << (BigInt(i) * 2n + 96n)

      result &= ~paramCompMask
      result |= BigInt(compLookUp[param.comparisonType]) << (BigInt(i) * 2n)
    })

    return result.toString()
  }

  it('no logs', async () => {
    const address = EthereumAddress.random()
    const provider = mockObject<DiscoveryProvider>({
      async getLogs(providedAddress, topics, fromBlock, toBlock) {
        expect(providedAddress).toEqual(address)
        expect(topics).toEqual([
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
        expect(fromBlock).toEqual(0)
        expect(toBlock).toEqual(BLOCK_NUMBER)
        return []
      },
    })

    const handler = new LineaRolesModuleHandler(
      'someName',
      { type: 'lineaRolesModule' },
      [],
      DiscoveryLogger.SILENT,
    )
    const value = await handler.execute(provider, address, BLOCK_NUMBER)
    expect(value).toEqual({
      field: 'someName',
      value: {
        defaultRoles: {},
        roles: {},
      },
      ignoreRelative: undefined,
    })
  })

  it('many logs', async () => {
    const address = EthereumAddress.random()
    const abiCoder = utils.defaultAbiCoder

    const MODULE_A = EthereumAddress.random()
    const MODULE_B = EthereumAddress.random()

    const TARGET_A = EthereumAddress.random()
    const TARGET_B = EthereumAddress.random()
    const TARGET_C = EthereumAddress.random()

    const FunctionA = 'function test(bytes32 id)'
    const FunctionB = 'function testSecond(bytes32 id)'
    const FunctionSigA = getFunctionSelector(FunctionA)
    const FunctionSigB = getFunctionSelector(FunctionB)

    const provider = mockObject<DiscoveryProvider>({
      async getLogs(providedAddress, topics, fromBlock, toBlock) {
        expect(providedAddress).toEqual(address)
        expect(topics).toEqual([
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
        expect(fromBlock).toEqual(0)
        expect(toBlock).toEqual(BLOCK_NUMBER)
        return [
          SetDefaultRole(MODULE_A, 2),
          SetDefaultRole(MODULE_B, 3),
          SetDefaultRole(MODULE_A, 4),
          AssignRoles(MODULE_A, [2, 3, 5], [true, true, true]),
          AssignRoles(MODULE_B, [2, 4], [true, true]),
          AssignRoles(MODULE_A, [5], [false]),
          AllowTarget(2, TARGET_A, 1),
          AllowTarget(2, TARGET_A, 0),
          AllowTarget(3, TARGET_B, 1),
          AllowTarget(4, TARGET_C, 2),
          AllowTarget(5, TARGET_A, 2),
          AllowTarget(6, TARGET_B, 2),
          RevokeTarget(5, TARGET_A),
          RevokeTarget(6, TARGET_B),
          ScopeTarget(2, TARGET_A),
          ScopeTarget(2, TARGET_B),

          ScopeAllowFunction(2, TARGET_A, FunctionSigA, 2, packScopeConfig({options: 'Both',         wildcarded: true,  parameters: []})), // prettier-ignore
          ScopeAllowFunction(5, TARGET_A, FunctionSigB, 1, packScopeConfig({options: 'None',         wildcarded: false, parameters: []})), // prettier-ignore
          ScopeAllowFunction(3, TARGET_C, FunctionSigA, 0, packScopeConfig({options: 'DelegateCall', wildcarded: false, parameters: []})), // prettier-ignore
          ScopeAllowFunction(4, TARGET_B, FunctionSigB, 3, packScopeConfig({options: 'Send',         wildcarded: true,  parameters: []})), // prettier-ignore
          ScopeAllowFunction(6, TARGET_B, FunctionSigB, 3, packScopeConfig({options: 'Both',         wildcarded: true,  parameters: []})), // prettier-ignore
          ScopeRevokeFunction(5, TARGET_A, FunctionSigA, '0'),
          ScopeRevokeFunction(6, TARGET_B, FunctionSigB, '0'),

          // prettier-ignore
          ScopeFunction(2, TARGET_C, FunctionSigB, [false, true, true, false], [0, 0, 2, 1], [0,1,2,3],
                        [abiCoder.encode(['uint8'], [15]),
                         abiCoder.encode(['uint256'], [420]),
                         abiCoder.encode(['address[]'], [[MODULE_A, MODULE_B]]),
                         abiCoder.encode(['string'], ['hello im a string'])],
                        2, packScopeConfig({options: 'Both', wildcarded: false, parameters: [
                            {type: 'Static',    comparisonType: 'EqualTo',     isScoped: false },
                            {type: 'Static',    comparisonType: 'GreaterThan', isScoped: true },
                            {type: 'Dynamic32', comparisonType: 'LessThan',    isScoped: true },
                            {type: 'Dynamic',   comparisonType: 'OneOf',       isScoped: false },
                        ]})),
          // prettier-ignore
          ScopeFunction(3, TARGET_B, FunctionSigB, [true, true], [0, 0], [2,1],
                        [abiCoder.encode(['uint256'], [42069]),
                         abiCoder.encode(['uint256'], [1415926535])],
                        1, packScopeConfig({options: 'DelegateCall', wildcarded: false, parameters: [
                            {type: 'Static', comparisonType: 'LessThan',    isScoped: true },
                            {type: 'Static', comparisonType: 'GreaterThan', isScoped: true },
                        ]})),
          // prettier-ignore
          ScopeFunctionExecutionOptions(3, TARGET_B, FunctionSigB, 0,
                                        packScopeConfig({options: 'DelegateCall', wildcarded: false, parameters: [
                                            {type: 'Static', comparisonType: 'LessThan',    isScoped: true },
                                            {type: 'Static', comparisonType: 'GreaterThan', isScoped: true },
                                        ]})),
          // prettier-ignore
          ScopeParameter(2, TARGET_C, FunctionSigB, 1, 2, 0, abiCoder.encode(['string'], ['this is another string']),
                         packScopeConfig({options: 'Both', wildcarded: false, parameters: [
                             {type: 'Static',    comparisonType: 'EqualTo',  isScoped: false },
                             {type: 'Dynamic',   comparisonType: 'EqualTo',  isScoped: true },
                             {type: 'Dynamic32', comparisonType: 'LessThan', isScoped: true },
                             {type: 'Dynamic',   comparisonType: 'OneOf',    isScoped: false },
                         ]})),
          // prettier-ignore
          ScopeParameter(4, TARGET_A, FunctionSigA, 0, 0, 0, abiCoder.encode(['uint256'], ['1410']),
                         packScopeConfig({options: 'Both', wildcarded: false, parameters: [
                             {type: 'Static', comparisonType: 'EqualTo', isScoped: true },
                         ]})),
          // prettier-ignore
          ScopeParameterAsOneOf(4, TARGET_A, FunctionSigA, 0, 2, [
                                    abiCoder.encode(['string'], ['first string in one of compare']),
                                    abiCoder.encode(['string'], ['second string in one of compare']),
                                ],
                                packScopeConfig({options: 'Both', wildcarded: false, parameters: [
                                    {type: 'Dynamic', comparisonType: 'OneOf',  isScoped: true },
                                ]})),
          // prettier-ignore
          ScopeParameterAsOneOf(4, TARGET_C, FunctionSigA, 0, 2, [
                                    abiCoder.encode(['string'], ['this is going to be overwritten']),
                                    abiCoder.encode(['string'], ['this is going to be overwritten aswell']),
                                ],
                                packScopeConfig({options: 'Both', wildcarded: false, parameters: [
                                    {type: 'Dynamic', comparisonType: 'OneOf',  isScoped: true },
                                ]})),
          // prettier-ignore
          ScopeParameter(4, TARGET_C, FunctionSigA, 0, 0, 0, abiCoder.encode(['uint256'], ['2023']),
                         packScopeConfig({options: 'Both', wildcarded: false, parameters: [
                             {type: 'Static', comparisonType: 'EqualTo', isScoped: true },
                         ]})),
          // prettier-ignore
          UnscopeParameter(3, TARGET_B, FunctionSigB, 0,
                           packScopeConfig({options: 'DelegateCall', wildcarded: false, parameters: [
                               {type: 'Static', comparisonType: 'LessThan',    isScoped: false },
                               {type: 'Static', comparisonType: 'GreaterThan', isScoped: true },
                           ]})),
        ]
      },
      getStorage: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
      call: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
      getMetadata: mockFn().resolvesTo({
        name: 'name',
        isVerified: true,
        abi: [FunctionA, FunctionB],
        source: 'name',
      }),
    })

    const handler = new LineaRolesModuleHandler(
      'someName',
      { type: 'lineaRolesModule' },
      [],
      DiscoveryLogger.SILENT,
    )
    const value = await handler.execute(provider, address, BLOCK_NUMBER)
    expect(value).toEqual({
      field: 'someName',
      value: {
        defaultRoles: {
          [MODULE_A.toString()]: 4,
          [MODULE_B.toString()]: 3,
        },
        roles: {
          2: {
            members: {
              [MODULE_A.toString()]: true,
              [MODULE_B.toString()]: true,
            },
            targets: {
              [TARGET_A.toString()]: {
                clearance: 'Function',
                options: 'None',
              },
              [TARGET_B.toString()]: {
                clearance: 'Function',
                options: 'None',
              },
            },
            functions: {
              [TARGET_C.toString()]: {
                'testSecond(bytes32)': {
                  options: 'Both',
                  parameters: [
                    {
                      comparisonType: 'EqualTo',
                      isScoped: false,
                      type: 'Static',
                    },
                    {
                      comparisonType: 'EqualTo',
                      isScoped: true,
                      type: 'Dynamic',
                    },
                    {
                      comparisonType: 'LessThan',
                      isScoped: true,
                      type: 'Dynamic32',
                    },
                    {
                      comparisonType: 'OneOf',
                      isScoped: false,
                      type: 'Dynamic',
                    },
                  ],
                  wildcarded: false,
                },
              },
              [TARGET_A.toString()]: {
                'test(bytes32)': {
                  options: 'Both',
                  parameters: [],
                  wildcarded: true,
                },
              },
            },
            compValues: {
              [`${TARGET_C.toString()}:testSecond(bytes32):0`]:
                '0x000000000000000000000000000000000000000000000000000000000000000f',
              [`${TARGET_C.toString()}:testSecond(bytes32):1`]: abiCoder.encode(
                ['string'],
                ['this is another string'],
              ),
              [`${TARGET_C.toString()}:testSecond(bytes32):2`]: abiCoder.encode(
                ['address[]'],
                [[MODULE_A, MODULE_B]],
              ),
              [`${TARGET_C.toString()}:testSecond(bytes32):3`]:
                '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001168656c6c6f20696d206120737472696e67000000000000000000000000000000',
            },
            compValuesOneOf: {},
          },
          3: {
            members: {
              [MODULE_A.toString()]: true,
            },
            targets: {
              [TARGET_B.toString()]: {
                clearance: 'Target',
                options: 'Send',
              },
            },
            functions: {
              [TARGET_B.toString()]: {
                'testSecond(bytes32)': {
                  options: 'DelegateCall',
                  parameters: [
                    {
                      comparisonType: 'LessThan',
                      isScoped: false,
                      type: 'Static',
                    },
                    {
                      comparisonType: 'GreaterThan',
                      isScoped: true,
                      type: 'Static',
                    },
                  ],
                  wildcarded: false,
                },
              },
              [TARGET_C.toString()]: {
                'test(bytes32)': {
                  options: 'DelegateCall',
                  parameters: [],
                  wildcarded: false,
                },
              },
            },
            compValues: {
              [`${TARGET_B.toString()}:testSecond(bytes32):1`]:
                '0x0000000000000000000000000000000000000000000000000000000054655307',
            },
            compValuesOneOf: {},
          },
          4: {
            members: {
              [MODULE_B.toString()]: true,
            },
            targets: {
              [TARGET_C.toString()]: {
                clearance: 'Target',
                options: 'DelegateCall',
              },
            },
            functions: {
              [TARGET_B.toString()]: {
                'testSecond(bytes32)': {
                  options: 'Send',
                  parameters: [],
                  wildcarded: true,
                },
              },
              [TARGET_A.toString()]: {
                'test(bytes32)': {
                  options: 'Both',
                  parameters: [
                    {
                      comparisonType: 'OneOf',
                      isScoped: true,
                      type: 'Dynamic',
                    },
                  ],
                  wildcarded: false,
                },
              },
              [TARGET_C.toString()]: {
                'test(bytes32)': {
                  options: 'Both',
                  parameters: [
                    {
                      comparisonType: 'EqualTo',
                      isScoped: true,
                      type: 'Static',
                    },
                  ],
                  wildcarded: false,
                },
              },
            },
            compValues: {
              [`${TARGET_C.toString()}:test(bytes32):0`]:
                '0x00000000000000000000000000000000000000000000000000000000000007e7',
            },
            compValuesOneOf: {
              [`${TARGET_A.toString()}:test(bytes32):0`]: [
                abiCoder.encode(['string'], ['first string in one of compare']),
                abiCoder.encode(
                  ['string'],
                  ['second string in one of compare'],
                ),
              ],
            },
          },
        },
      },
      ignoreRelative: undefined,
    })
  })

  it('passes relative ignore', async () => {
    const address = EthereumAddress.random()
    const provider = mockObject<DiscoveryProvider>({
      async getLogs() {
        return []
      },
    })

    const handler = new LineaRolesModuleHandler(
      'someName',
      {
        type: 'lineaRolesModule',
        ignoreRelative: true,
      },
      [],
      DiscoveryLogger.SILENT,
    )
    const value = await handler.execute(provider, address, BLOCK_NUMBER)
    expect(value).toEqual({
      field: 'someName',
      value: {
        defaultRoles: {},
        roles: {},
      },
      ignoreRelative: true,
    })
  })
})
