import type { ApiPromise } from '@polkadot/api'

export class AvailClient {
  constructor(private readonly rpcUrl: string) {}

  async getStakingEraOverview(): Promise<Record<string, Exposure>> {
    const api = await this.createApi()
    try {
      const currentEra = await api.query.staking.currentEra()
      const overview = (await api.query.staking.erasStakersOverview.entries(
        currentEra.toHuman() as string,
      )) as unknown as [ValidatorKeysCodec, ValidatorValueCodec][]

      const validatorsOverview = overview.reduce(
        (
          acc: Record<string, Exposure>,
          [validatorKeys, value]: [ValidatorKeysCodec, ValidatorValueCodec],
        ) => {
          const [, validator] = validatorKeys.toHuman()
          const { own, total } = value.toPrimitive()

          acc[validator] = {
            own: BigInt(own),
            total: BigInt(total),
          }

          return acc
        },
        {},
      )

      return validatorsOverview
    } finally {
      await api.disconnect().catch(() => {})
    }
  }

  private async createApi(): Promise<ApiPromise> {
    const { ApiPromise, HttpProvider } = await import('@polkadot/api')
    const api = new ApiPromise({
      provider: new HttpProvider(this.rpcUrl),
      noInitWarn: true,
      throwOnConnect: true,
    })
    api.on('error', () => {})
    try {
      await api.isReadyOrError
    } catch (error) {
      await api.disconnect().catch(() => {})
      throw error
    }
    return api
  }
}

type Codec<T> = {
  toHuman: () => T
  toPrimitive: () => T
}

type ValidatorKeysCodec = Codec<[string, string]>
type ValidatorValueCodec = Codec<{ own: string; total: string }>

type Exposure = {
  own: bigint
  total: bigint
}
