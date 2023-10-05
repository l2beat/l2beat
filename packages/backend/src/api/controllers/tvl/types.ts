type SuccessResult<T> = { result: 'success'; data: T }
type ErrorResult<E> = { result: 'error'; error: E }
export type Result<T, E> = SuccessResult<T> | ErrorResult<E>
