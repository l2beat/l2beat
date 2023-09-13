import { Logger } from '@l2beat/backend-tools'

import { ChildIndexer } from '../src/BaseIndexer'
import { HourlyIndexer } from './HourlyIndexer.example'

interface IndexerDataRepository {
  addData(data: number[]): Promise<void>
  removeAfter(number: number): Promise<void>
}

interface IndexerStateRepository {
  getSafeHeight(): Promise<number>
  setSafeHeight(height: number): Promise<void>
  getConfigHash(): Promise<string>
  setConfigHash(hash: string): Promise<void>
}
interface Config {
  number: number
  getConfigHash(): string
}

export class ConfigurableIndexer extends ChildIndexer {
  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly config: Config,
    private readonly dataRepository: IndexerDataRepository,
    private readonly stateRepository: IndexerStateRepository,
  ) {
    super(logger, [parentIndexer])
  }

  override async start(): Promise<void> {
    const oldConfigHash = await this.stateRepository.getConfigHash()
    const newConfigHash = this.config.getConfigHash()
    if (oldConfigHash !== newConfigHash) {
      await this.stateRepository.setSafeHeight(0)
      await this.stateRepository.setConfigHash(newConfigHash)
    }
    await super.start()
  }

  override async update(from: number, to: number): Promise<number> {
    const data = []
    for (let i = from + 1; i <= to; i++) {
      data.push(i)
    }

    await this.dataRepository.addData(data)
    return to
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.dataRepository.removeAfter(targetHeight)
    return targetHeight
  }

  override async getSafeHeight(): Promise<number> {
    const height = await this.stateRepository.getSafeHeight()
    return height
  }

  override async setSafeHeight(height: number): Promise<void> {
    return this.stateRepository.setSafeHeight(height)
  }
}
