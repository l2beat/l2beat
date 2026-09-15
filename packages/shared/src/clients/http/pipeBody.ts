/**
 * Returns a response whose body flows through `transform`; a bodiless one
 * (204, HEAD) is returned as is. Status, statusText and headers survive the
 * rebuild, `url`, `redirected` and `type` do not, and no caller reads them.
 */
export function pipeBody(
  response: Response,
  transform: TransformStream<Uint8Array, Uint8Array>,
): Response {
  if (!response.body) {
    return response
  }
  return new Response(response.body.pipeThrough(transform), response)
}
