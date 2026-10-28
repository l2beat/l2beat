import type { CountedOperation } from '../types'

export function traverseOperationTree<T>(
  rootOperation: CountedOperation,
  context: T,
  action: (operation: CountedOperation, acc: T) => void,
) {
  const stack = [rootOperation]
  for (let operation = stack.pop(); operation; operation = stack.pop()) {
    action(operation, context)
    stack.push(...[...operation.children].reverse())
  }
}
