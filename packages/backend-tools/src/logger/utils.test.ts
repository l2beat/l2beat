import { expect } from 'earl'
import { tagService } from './utils'

describe(tagService.name, () => {
  it('redacts a key in the path of a service url followed by a tag', () => {
    expect(
      tagService('https://rpc.example.com/v2/AbCdEf0123456789', 'rpc'),
    ).toEqual('https://rpc.example.com/v2/REDACTED:rpc')
  })
})
