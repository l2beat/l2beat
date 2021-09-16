export class CastError extends TypeError {
  constructor(type: string) {
    super(`Value mismatch. Expected ${type}.`)
  }
}
