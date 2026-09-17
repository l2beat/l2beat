import { describe, expect, it } from 'vitest'
import { pipeBody } from './pipeBody'

describe(pipeBody.name, () => {
  it('streams the body through the transform and keeps the metadata', async () => {
    const response = new Response('abc', {
      status: 201,
      headers: { 'x-test': 'yes' },
    })
    const piped = pipeBody(response, upperCase())
    expect(await piped.text()).toBe('ABC')
    expect(piped.status).toBe(201)
    expect(piped.headers.get('x-test')).toBe('yes')
  })

  it('returns a bodiless response untouched', () => {
    const response = new Response(null, { status: 204 })
    expect(pipeBody(response, upperCase())).toBe(response)
  })
})

function upperCase() {
  return new TransformStream<Uint8Array, Uint8Array>({
    transform: (chunk, controller) =>
      controller.enqueue(
        new TextEncoder().encode(new TextDecoder().decode(chunk).toUpperCase()),
      ),
  })
}
