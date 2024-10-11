import type { CountedOperation } from '@/types'

export function traverseOperationTree<T>(
  rootOperation: CountedOperation,
  context: T,
  action: (operation: CountedOperation, acc: T) => void,
) {
  action(rootOperation, context)
  for (const child of rootOperation.children) {
    traverseOperationTree(child, context, action)
  }
}
