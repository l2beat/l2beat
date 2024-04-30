export type Result<S, E> = SuccessResult<S> | ErrorResult<E>

export interface SuccessResult<S> {
  type: 'success'
  data: S
}

export interface ErrorResult<E> {
  type: 'error'
  error: E
}
