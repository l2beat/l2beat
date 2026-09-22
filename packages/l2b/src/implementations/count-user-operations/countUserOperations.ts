import {
  EIP712_methods,
  EIP7821_methods,
  ERC20ROUTER_methods,
  ERC4337_methods,
  MULTICALLV3_methods,
  type Operation,
  SAFE_methods,
} from '@l2beat/shared/uops'
import { FourByteClient } from './FourByteClient'

const methods = [
  ...ERC4337_methods,
  ...SAFE_methods,
  ...MULTICALLV3_methods,
  ...EIP712_methods,
  ...EIP7821_methods,
  ...ERC20ROUTER_methods,
]

interface CountedOperation {
  level: number
  name: string
  count: number
  children: CountedOperation[]
}

function countOperations(
  operation: Operation,
  level: number,
): CountedOperation {
  if (operation.type !== 'recursive') {
    return {
      level,
      name: operation.name ?? 'static',
      count: operation.count,
      children: [],
    }
  }

  const selector = operation.calldata.slice(0, 10)
  const method = methods.find((m) => m.selector === selector)
  if (!method) {
    return { level, count: 1, name: selector, children: [] }
  }

  const operations = method.count(operation.calldata)
  let count = 0
  const children: CountedOperation[] = []
  for (const operation of operations) {
    const result = countOperations(operation, level + 1)
    count += result.count
    children.push(result)
  }
  return { level, name: method.name ?? selector, count, children }
}

export async function countUserOperations(calldata: string) {
  const counted = countOperations({ type: 'recursive', calldata }, 0)
  const selectors = new Set<string>()
  addSelectors(counted, selectors)

  const fourByteClient = new FourByteClient()
  const signatures: Record<string, string> = {}
  for (const selector of selectors) {
    const signature = await fourByteClient.getSignature(selector)
    if (signature) {
      const name = signature.split('(')[0]
      signatures[selector] = `${name} - ${selector}`
    }
  }

  replaceSelectors(counted, signatures)
  printItems(counted)
}

function replaceSelectors(
  operation: CountedOperation,
  signatures: Record<string, string>,
) {
  if (/^0x[0-9a-f]{8}$/.test(operation.name)) {
    const signature = signatures[operation.name]
    if (signature) {
      operation.name = signature.split('(')[0]
    }
  }
  for (const child of operation.children) {
    replaceSelectors(child, signatures)
  }
}

function addSelectors(operation: CountedOperation, selectors: Set<string>) {
  if (/^0x[0-9a-f]{8}$/.test(operation.name)) {
    selectors.add(operation.name)
  }
  for (const child of operation.children) {
    addSelectors(child, selectors)
  }
}

function printItems(operation: CountedOperation) {
  printItem(operation.level, operation.name, operation.count)
  for (const child of operation.children) {
    printItems(child)
  }
}

function printItem(level: number, name: string, count: number) {
  console.log(`${'  '.repeat(level)}${name} (${count})`)
}
