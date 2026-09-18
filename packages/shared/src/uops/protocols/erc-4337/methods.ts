import { ethers } from 'ethers'
import type { Method, Operation } from '../../types'
import { defineMethod } from '../defineMethod'

interface UserOperation {
  sender: string
  initCode: string
  callData: string
}

interface Call {
  to: string
  data: string
}

interface TargetCall {
  target: string
  data: string
}

export const ERC4337_methods: Method[] = [
  defineMethod(
    'function handleOps(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature)[] calldata ops, address beneficiary)',
    ([ops]) => {
      return ops.flatMap((op: UserOperation) => {
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
    'function handleOps(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, bytes32 accountGasLimits, uint256 preVerificationGas, bytes32 gasFees, bytes paymasterAndData, bytes signature)[] calldata ops, address beneficiary)',
    ([ops]) => {
      return ops.flatMap((op: UserOperation) => {
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
    'function handleOps(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, bytes32 accountGasLimits, uint256 preVerificationGas, bytes32 gasFees, bytes paymasterAndData, bytes signature)[] calldata ops, address beneficiary)',
    ([ops]) => {
      return ops.flatMap((op: UserOperation) => {
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
    'function executeBatch(address[] addresses, bytes[] inputs)',
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
    'function execute(address,uint256,bytes)',
    ([to, , calldata]) => {
      return [{ type: 'recursive', calldata, to }]
    },
    'SmartAccount',
  ),
  defineMethod(
    'function executeBatch(tuple(address to, uint256 value, bytes data)[] calls)',
    ([calls]) => {
      return calls.map((call: Call) => ({
        type: 'recursive',
        calldata: call.data,
        to: call.to,
      }))
    },
    'SmartAccount',
  ),
  defineMethod(
    'function execute4337Ops(tuple(address target, uint256 value, bytes data)[] calls)',
    ([calls]) => {
      return calls.map((call: TargetCall) => ({
        type: 'recursive',
        calldata: call.data,
        to: call.target,
      }))
    },
    'SmartAccount',
  ),
  defineMethod(
    'function executeBatch(address[] targets, uint256[] values, bytes[] inputs)',
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
    'function executeBatch(address[] targets, uint256[] values, bytes[] inputs)',
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
    'function executeBatch(address[] targets, uint256[] values, bytes[] inputs)',
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
    'function execute(tuple(address target, uint256 value, bytes data) execution)',
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
    'function executeBatch_y6U(address[] dest, uint256[] value, bytes[] func)',
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
    'function execute(bytes32 execMode, bytes executionCalldata)',
    ([execMode, executionCalldata]) => {
      return decodeCalldata(execMode, executionCalldata)
    },
    'SmartAccount',
  ),
  defineMethod(
    'function executeAndRevert(address to, uint256 value, bytes data, uint8 operation)',
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
    'function execute(address to, uint256 value, bytes memory data, uint8 _operation)',
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
    'function execTransactionFromEntrypoint(address to, uint256 value, bytes data)',
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
    'function execute_ncC(address to, uint256 value, bytes data)',
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
    'function executeUserOpWithErrorString(address to, uint256 value, bytes data, uint8 operation)',
    ([to, , data]) => {
      return [
        {
          type: 'recursive',
          calldata: data,
          to,
        },
      ]
    },
  ),
  defineMethod(
    'function executeBySender(tuple(address to, uint256 value, bytes data)[] calls)',
    ([calls]) => {
      return calls.map((call: { to: string; data: string }) => ({
        type: 'recursive',
        calldata: call.data,
        to: call.to,
      }))
    },
  ),
  defineMethod(
    'function executeWithoutChainIdValidation(bytes[] calldata calls)',
    ([calls]) => {
      return calls.map((call: string) => ({
        type: 'recursive',
        calldata: call,
        to: 'unknown',
      }))
    },
  ),
  defineMethod(
    'function installValidation(bytes25 validationConfig, bytes4[] calldata selectors, bytes calldata installData, bytes[] calldata hooks)',
    ([, , installData]) => {
      // installData is bytes calldata containing the installation payload
      // It will be recursively decoded; target address is embedded within
      if (!installData || installData === '0x') {
        return []
      }
      return [
        {
          type: 'recursive',
          calldata: installData,
          to: 'unknown',
        },
      ]
    },
  ),
  defineMethod(
    'function executeComposable(tuple(address,uint256,bytes4,tuple(uint8,bytes,tuple(uint8,bytes)[])[],tuple(uint8,bytes)[])[])',
    ([executions]) => {
      // ComposableExecution struct mapping:
      // [0] address to          - target contract address
      // [1] uint256 value       - ETH value to send
      // [2] bytes4 functionSig  - 4-byte function selector (NOT full calldata)
      // [3] InputParam[] inputParams - array of (fetcherType, paramData, constraints[])
      // [4] OutputParam[] outputParams - array of (fetcherType, paramData)
      //
      // IMPORTANT: execution[2] is ONLY the 4-byte function selector, not full calldata.
      // Full calldata reconstruction would require encoding inputParams, which is complex
      // because fetcherType determines how paramData is used (RAW_BYTES vs STATIC_CALL).
      // For tracking/analysis purposes, we use the selector as an identifier.

      if (!Array.isArray(executions)) {
        return []
      }

      return executions
        .filter(
          (
            execution: unknown,
          ): execution is [string, unknown, string, unknown, unknown] =>
            Array.isArray(execution) &&
            execution.length >= 3 &&
            typeof execution[0] === 'string' &&
            typeof execution[2] === 'string',
        )
        .map((execution) => {
          const to = execution[0]
          const selector = execution[2] // bytes4 functionSig as hex string

          return {
            type: 'recursive',
            calldata: selector, // bytes4 functionSig (selector only)
            to,
          }
        })
    },
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

      const decodedParams = ethers.utils.defaultAbiCoder.decode(
        ['tuple(address target, uint256 value, bytes callData)[]'],
        executionCalldata,
      )

      decodedParams[0].forEach(
        (value: { target: string; callData: string }) => {
          operations.push({
            type: 'recursive',
            calldata: value.callData,
            to: value.target,
          })
        },
      )

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
