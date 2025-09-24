import { ApiPromise, WsProvider } from '@polkadot/api'

export class AvailWsClient {
  private api!: ApiPromise
  constructor(private readonly wsUrl: string) {}

  async connect() {
    const wsProvider = new WsProvider(this.wsUrl)
    this.api = new ApiPromise({ provider: wsProvider, noInitWarn: true })
    await this.api.isReady
  }

  async disconnect() {
    await this.api.disconnect()
  }

  async getCurrentEra() {
    const currentEra = await this.api.query.staking.currentEra()

    return currentEra.toHuman() as string
  }

  async getStakingEraOverview(era: string) {
    const overview = (await this.api.query.staking.erasStakersOverview.entries(
      era,
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
