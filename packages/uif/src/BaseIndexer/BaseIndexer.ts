import { Indexer, Subscription, UpdateEvent } from '../Indexer'
import { JobQueue } from '../tools/JobQueue'
import { json } from '../tools/json'
import { Logger } from '../tools/Logger'
import {
  BaseIndexerAction,
  baseIndexerReducer,
  BaseIndexerState,
  getInitialState,
} from './reducer'

export abstract class BaseIndexer implements Indexer {
  abstract update(from: number, to: number): Promise<void>

  private state: BaseIndexerState
  private readonly effectsQueue: JobQueue
  constructor(
    private readonly logger: Logger,
    public readonly dependencies: Indexer[],
    public readonly parameters: json,
    config: { batchSize: number },
  ) {
    this.state = getInitialState(dependencies, config.batchSize)
    this.dependencies.forEach((dependency, index) => {
      dependency.subscribe((event) => {
        this.dispatch({
          type: 'DependencyUpdated',
          index,
          height: event.height,
        })
      })
    })
    this.effectsQueue = new JobQueue({ maxConcurrentJobs: 1 }, this.logger)
  }

  subscribe(callback: (event: UpdateEvent) => void): Subscription {
    throw new Error('Method not implemented.')
  }

  start(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getHeight(): number {
    return this.state.height
  }

  private dispatch(action: BaseIndexerAction): void {
    const [newState, effects] = baseIndexerReducer(this.state, action)

    this.state = newState

    this.logger.debug('Dispatching', {
      action: action as any,
      effects: effects as any,
    })
    effects.forEach((effect) => {
      switch (effect.type) {
        case 'Update':
          this.effectsQueue.add({
            name: 'Update',
            execute: async () => {
              const from = this.state.height
              this.dispatch({ type: 'UpdateStarted', from, to: effect.to })
              await this.update(from, effect.to)
              this.dispatch({ type: 'UpdateSucceeded', from, to: effect.to })
            },
          })
          break
        default:
          throw new Error('unreachable')
      }
    })
  }
}
