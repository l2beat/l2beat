export const trpcTransformer = {
  // tRPC uses Serialize<T> for outputs when no transformer is configured, which
  // turns required `T | undefined` fields into optional fields. Runtime payloads
  // are still JSON-encoded by the transport, so this identity transformer is
  // here to preserve router output types without changing wire serialization.
  serialize: <T>(value: T) => value,
  deserialize: <T>(value: T) => value,
}
