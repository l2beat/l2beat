/**
 * Errors keep their message static and carry values in `cause`, so a test
 * that cares about a value needs the error itself, not `toThrow(message)`.
 */
export function thrownBy(fn: () => unknown): Error {
  try {
    fn()
  } catch (error) {
    if (error instanceof Error) {
      return error
    }
    throw new Error('Expected an Error to be thrown', { cause: { error } })
  }
  throw new Error('Expected the function to throw')
}

export async function rejectedBy(promise: Promise<unknown>): Promise<Error> {
  try {
    await promise
  } catch (error) {
    if (error instanceof Error) {
      return error
    }
    throw new Error('Expected an Error to be rejected', { cause: { error } })
  }
  throw new Error('Expected the promise to reject')
}
