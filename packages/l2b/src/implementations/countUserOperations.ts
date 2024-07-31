import { utils } from 'ethers'

type Operation = StaticOperation | RecursiveOperation

interface StaticOperation {
  type: 'static'
  name: string
  count: number
}

interface RecursiveOperation {
  type: 'recursive'
  calldata: string
}

interface Method {
  name: string
  selector: string
  count(calldata: string): Operation[]
}

const methods: Method[] = [
  defineMethod(
    `function handleOps(
    (
      address sender,
      uint256 nonce,
      bytes initCode,
      bytes callData,
      uint256 callGasLimit,
      uint256 verificationGasLimit,
      uint256 preVerificationGas,
      uint256 maxFeePerGas,
      uint256 maxPriorityFeePerGas,
      bytes paymasterAndData,
      bytes signature
    )[] calldata ops,
    address payable beneficiary
  )`,
    (decoded) => {
      return decoded.ops.flatMap((op: utils.Result) => {
        const operations: Operation[] = []
        if (op.initCode && op.initCode !== '0x') {
          operations.push({
            type: 'static',
            name: 'contract deployment',
            count: 1,
          })
        }
        operations.push({ type: 'recursive', calldata: op.callData })
        return operations
      })
    },
  ),
  defineMethod(
    'function executeBatch(address[] addresses, bytes[] inputs)',
    (decoded) => {
      if (decoded.addresses.length !== decoded.inputs.length) {
        return []
      }
      return decoded.inputs.map((input: string) => ({
        type: 'recursive',
        calldata: input,
      }))
    },
  ),
]

function defineMethod(
  humanReadableAbi: string,
  countOperations: (decoded: utils.Result) => Operation[],
): Method {
  const abi = new utils.Interface([humanReadableAbi])
  const method = abi.functions[Object.keys(abi.functions)[0]].name
  return {
    name: method,
    selector: abi.getSighash(method),
    count(calldata: string) {
      const decoded = abi.decodeFunctionData(method, calldata)
      return countOperations(decoded)
    },
  }
}

function countOperations(
  operation: Operation,
  level: number,
): { count: number; print: () => void } {
  if (operation.type === 'static') {
    return {
      count: operation.count,
      print: () => printItem(level, operation.name, operation.count),
    }
  }

  const selector = operation.calldata.slice(0, 10)
  const method = methods.find((m) => m.selector === selector)
  if (!method) {
    return {
      count: 1,
      print: () => printItem(level, `unknown ${selector}`, 1),
    }
  }

  const operations = method.count(operation.calldata)
  let count = 0
  const prints: (() => void)[] = []
  for (const operation of operations) {
    const result = countOperations(operation, level + 1)
    count += result.count
    prints.push(result.print)
  }
  return {
    count,
    print: () => {
      printItem(level, method.name, count)
      prints.forEach((print) => print())
    },
  }
}

function printItem(level: number, name: string, count: number) {
  console.log(`${'  '.repeat(level)}${name} (${count})`)
}

export function countUserOperations(calldata: string) {
  countOperations({ type: 'recursive', calldata }, 0).print()
}
