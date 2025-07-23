import { ethers } from 'ethers'
import { decodeAbiParameters, parseAbiItem, parseAbiParameters } from 'viem'
import type { Method, Operation } from '../../types'
import { defineMethod } from '../defineMethod'

export const ERC4337_methods: Method[] = [
  defineMethod(
    parseAbiItem(
      'function handleOps((address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature)[] calldata ops, address beneficiary)',
    ),
    ([ops]) => {
      return ops.flatMap((op) => {
        const operations: Operation[] = []
        if (op.initCode && op.initCode !== '0x') {
          operations.push({
            type: 'static',
            name: 'contract_deployment',
            count: 1,
          })
        }
        operations.push({
          type: 'recursive',
          calldata: op.callData,
          to: op.sender,
        })
        return operations
      })
    },
    'ERC-4337:EntryPoint0.6.0',
  ),
  defineMethod(
    parseAbiItem(
      'function handleOps((address sender, uint256 nonce, bytes initCode, bytes callData, bytes32 accountGasLimits, uint256 preVerificationGas, bytes32 gasFees, bytes paymasterAndData, bytes signature)[] calldata ops, address beneficiary)',
    ),
    ([ops]) => {
      return ops.flatMap((op) => {
        const operations: Operation[] = []
        if (op.initCode && op.initCode !== '0x') {
          operations.push({
            type: 'static',
            name: 'contract_deployment',
            count: 1,
          })
        }
        operations.push({
          type: 'recursive',
          calldata: op.callData,
          to: op.sender,
        })
        return operations
      })
    },
    'ERC-4337:EntryPoint0.7.0',
  ),
  defineMethod(
    parseAbiItem(
      'function handleOps((address sender, uint256 nonce, bytes initCode, bytes callData, bytes32 accountGasLimits, uint256 preVerificationGas, bytes32 gasFees, bytes paymasterAndData, bytes signature)[] calldata ops, address beneficiary)',
    ),
    ([ops]) => {
      return ops.flatMap((op) => {
        const operations: Operation[] = []
        if (op.initCode && op.initCode !== '0x') {
          operations.push({
            type: 'static',
            name: 'contract_deployment',
            count: 1,
          })
        }
        operations.push({
          type: 'recursive',
          calldata: op.callData,
          to: op.sender,
        })
        return operations
      })
    },
    'ERC-4337:EntryPoint0.8.0',
  ),
  defineMethod(
    parseAbiItem('function executeBatch(address[] addresses, bytes[] inputs)'),
    ([addresses, inputs]) => {
      if (addresses.length !== inputs.length) {
        return []
      }
      return inputs.map((input: string, index: number) => ({
        type: 'recursive',
        calldata: input,
        to: addresses[index],
      }))
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem('function execute(address,uint256,bytes)'),
    ([to, , calldata]) => {
      return [{ type: 'recursive', calldata, to }]
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem(
      'function executeBatch((address to, uint256 value, bytes data)[] calls)',
    ),
    ([calls]) => {
      return calls.map((call) => ({
        type: 'recursive',
        calldata: call.data,
        to: call.to,
      }))
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem(
      'function execute4337Ops((address target, uint256 value, bytes data)[] calls)',
    ),
    ([calls]) => {
      return calls.map((call) => ({
        type: 'recursive',
        calldata: call.data,
        to: call.target,
      }))
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem(
      'function executeBatch(address[] targets, uint256[] values, bytes[] inputs)',
    ),
    ([targets, , inputs]) => {
      return inputs.map((input: string, index: number) => ({
        type: 'recursive',
        calldata: input,
        to: targets[index],
      }))
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem(
      'function executeBatch(address[] targets, uint256[] values, bytes[] inputs)',
    ),
    ([targets, , inputs]) => {
      return inputs.map((input: string, index: number) => ({
        type: 'recursive',
        calldata: input,
        to: targets[index],
      }))
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem(
      'function executeBatch(address[] targets, uint256[] values, bytes[] inputs)',
    ),
    ([targets, , inputs]) => {
      return inputs.map((input: string, index: number) => ({
        type: 'recursive',
        calldata: input,
        to: targets[index],
      }))
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem(
      'function execute((address target, uint256 value, bytes data) execution)',
    ),
    ([execution]) => {
      return [
        {
          type: 'recursive',
          calldata: execution.data,
          to: execution.target,
        },
      ]
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem(
      'function executeBatch_y6U(address[] dest, uint256[] value, bytes[] func)',
    ),
    ([dest, , func]) => {
      return func.map((input: string, index: number) => ({
        type: 'recursive',
        calldata: input,
        to: dest[index],
      }))
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem('function execute(bytes32 execMode, bytes executionCalldata)'),
    ([execMode, executionCalldata]) => {
      return decodeCalldata(execMode, executionCalldata)
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem(
      'function executeAndRevert(address to, uint256 value, bytes data, uint8 operation)',
    ),
    ([to, , data]) => {
      return [
        {
          type: 'recursive',
          calldata: data,
          to,
        },
      ]
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem(
      'function execute(address to, uint256 value, bytes memory data, uint8 _operation)',
    ),
    ([to, , data]) => {
      return [
        {
          type: 'recursive',
          calldata: data,
          to,
        },
      ]
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem(
      'function execTransactionFromEntrypoint(address to, uint256 value, bytes data)',
    ),
    ([to, , data]) => {
      return [
        {
          type: 'recursive',
          calldata: data,
          to,
        },
      ]
    },
    'SmartAccount',
  ),
  defineMethod(
    parseAbiItem('function execute_ncC(address to, uint256 value, bytes data)'),
    ([to, , data]) => {
      return [
        {
          type: 'recursive',
          calldata: data,
          to,
        },
      ]
    },
    'SmartAccount',
  ),
]

function decodeCalldata(
  execMode: string,
  executionCalldata: `0x${string}`,
): Operation[] {
  const CALLTYPE_SINGLE = 0x00
  const CALLTYPE_BATCH = 0x01
  const CALLTYPE_DELEGATECALL = 0xff

  try {
    const execModeBuffer = ethers.utils.arrayify(execMode)
    const callType = execModeBuffer[0]

    const executionCalldataBuffer = ethers.utils.arrayify(executionCalldata)

    if (callType === CALLTYPE_SINGLE) {
      // First 32 bytes is the address
      const to = ethers.utils.getAddress(
        ethers.utils.hexlify(executionCalldataBuffer.slice(0, 20)),
      )

      // Next 32 bytes is the value (amount in wei to send)
      const _value = ethers.BigNumber.from(
        executionCalldataBuffer.slice(20, 52),
      ).toBigInt()

      // Following the dataLength, we extract the data
      const data = executionCalldataBuffer.slice(52)

      return [
        {
          type: 'recursive',
          calldata: ethers.utils.hexlify(data),
          to,
        },
      ]
    }

    if (callType === CALLTYPE_BATCH) {
      const operations: Operation[] = []

      const decodedParams = decodeAbiParameters(
        parseAbiParameters(
          '(address target, uint256 value, bytes callData)[] executions',
        ),
        executionCalldata,
      )

      decodedParams[0].forEach((value) => {
        operations.push({
          type: 'recursive',
          calldata: value.callData,
          to: value.target,
        })
      })

      return operations
    }

    if (callType === CALLTYPE_DELEGATECALL) {
      // First 32 bytes is the address
      const to = ethers.utils.getAddress(
        ethers.utils.hexlify(executionCalldataBuffer.slice(0, 20)),
      )

      // The rest is the calldata
      const calldata = ethers.utils.hexlify(executionCalldataBuffer.slice(20))

      return [
        {
          type: 'recursive',
          calldata,
          to,
        },
      ]
    }

    throw new Error('Kernel - Unknown call type')
  } catch {
    return [
      {
        type: 'static',
        name: 'FAILED_TO_DECODE',
        count: 1,
      },
    ]
  }
}
