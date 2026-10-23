import { assign, CommentArray } from 'comment-json'

/**
 * Recursively clones an object while preserving all comment-json metadata
 * (comments, before/after, etc.) at every nesting level.
 *
 * The `assign` function from comment-json only does shallow copying, so nested
 * objects/arrays lose their comment metadata. This function recursively applies
 * the cloning to preserve comments at all nesting levels.
 */
export function clone<T>(value: T): T {
  // Handle primitives and null/undefined
  if (value === null || value === undefined) {
    return value
  }

  // Handle arrays - use CommentArray to preserve array comments
  if (Array.isArray(value)) {
    // Create a new CommentArray and recursively clone elements
    const clonedArray = new CommentArray()

    for (let i = 0; i < value.length; i++) {
      clonedArray[i] = clone(value[i])
    }

    // Copy comment metadata from original array to cloned array
    // assign handles the symbol properties that store comment data
    return assign(clonedArray, value) as T
  }

  // Handle objects
  if (typeof value === 'object') {
    // First use assign to create a shallow copy with comment metadata
    const clonedObj = assign({}, value as object) as Record<string, unknown>

    // Then recursively clone all property values
    for (const key in clonedObj) {
      if (Object.hasOwn(clonedObj, key)) {
        clonedObj[key] = clone(clonedObj[key])
      }
    }

    return clonedObj as T
  }

  // Primitives (string, number, boolean) - return as is
  return value
}
