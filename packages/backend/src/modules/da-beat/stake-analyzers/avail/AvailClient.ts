import { ApiPromise, WsProvider } from '@polkadot/api'

export class AvailClient {
  private api!: ApiPromise
  constructor(private readonly wsUrl: string) {}

  static create(_: unknown, options: { url: string }) {
    return new AvailClient(options.url)
  }

  async connect() {
    const wsProvider = new WsProvider(this.wsUrl)
    this.api = new ApiPromise({ provider: wsProvider, noInitWarn: true })
    await this.api.isReady
  }

  async disconnect() {
    await this.api.disconnect()
  }

  async getActiveValidators() {
    const activeValidators = await this.api.query.session.validators()

    return activeValidators.toHuman() as string[]
  }

  async getValidatorData(validators: string[]) {
    const validatorData = await Promise.all(
      validators.map(async (validatorAddress) => {
        const totalStaked = await this.getStakingInfo(validatorAddress)

        return {
          address: validatorAddress,
          totalStaked,
        }
      }),
    )

    return validatorData
  }

  private async getStakingInfo(validatorAddress: string) {
    const stakingLedger = await this.api.query.staking.ledger(validatorAddress)

    const primitive = stakingLedger.toPrimitive() as PrimitiveStakingInfo

    return toStakingInfo(primitive)
  }
}

function toStakingInfo(primitive: PrimitiveStakingInfo): StakingInfo {
  return {
    stash: primitive.stash,
    total: BigInt(primitive.total),
    active: BigInt(primitive.active),
  }
}

type PrimitiveStakingInfo = {
  stash: string
  total: string
  active: string
}

type StakingInfo = {
  stash: string
  total: bigint
  active: bigint
}
