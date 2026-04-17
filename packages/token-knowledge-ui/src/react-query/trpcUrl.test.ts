import { expect } from 'earl'
import { getTrpcProxyTarget } from './trpcUrl'

describe('tRPC URL helpers', () => {
  describe(getTrpcProxyTarget.name, () => {
    it('uses the local token-knowledge server by default', () => {
      expect(getTrpcProxyTarget(undefined)).toEqual('http://localhost:3007/')
    })

    it('keeps the server base path when given a server origin', () => {
      expect(getTrpcProxyTarget('https://token-knowledge.example.com')).toEqual(
        'https://token-knowledge.example.com/',
      )
      expect(
        getTrpcProxyTarget('https://token-knowledge.example.com/api'),
      ).toEqual('https://token-knowledge.example.com/api')
    })

    it('strips a trailing /trpc so the proxy does not forward to /trpc/trpc', () => {
      expect(
        getTrpcProxyTarget('https://token-knowledge.example.com/trpc'),
      ).toEqual('https://token-knowledge.example.com/')
      expect(
        getTrpcProxyTarget('https://token-knowledge.example.com/api/trpc/'),
      ).toEqual('https://token-knowledge.example.com/api')
    })
  })
})
