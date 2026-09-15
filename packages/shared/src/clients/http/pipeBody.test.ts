import { expect } from 'earl'
import { pipeBody } from './pipeBody'

describe(pipeBody.name, () => {
  it('streams the body through the transform and keeps the metadata', async () => {
    const response = new Response('abc', {
      status: 201,
      headers: { 'x-test': 'yes' },
    })
    const piped = pipeBody(response, upperCase())
    expect(await piped.text()).toEqual('ABC')
    expect(piped.status).toEqual(201)
    expect(piped.headers.get('x-test')).toEqual('yes')
  })

  it('returns a bodiless response untouched', () => {
    const response = new Response(null, { status: 204 })
    expect(pipeBody(response, upperCase())).toExactlyEqual(response)
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
