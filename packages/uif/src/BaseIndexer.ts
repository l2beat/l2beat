import { Logger } from '@l2beat/backend-tools'

import { Indexer, Subscription, SubscriptionCallback } from './Indexer'
import {
  BaseIndexerAction,
  baseIndexerReducer,
  BaseIndexerState,
  getInitialState,
  UpdateEffect,
  UpdateHeightEffect,
} from './reducer'

export abstract class BaseIndexer implements Indexer {
  private subscriptionCallbacks: SubscriptionCallback[] = []

  /**
   *
   * @param from - inclusive
   * @param to - inclusive
   */
  abstract update(from: number, to: number): Promise<void>

  private state: BaseIndexerState

  constructor(
    protected logger: Logger,
    public readonly parents: Indexer[],
    config: { batchSize: number },
  ) {
    this.logger = this.logger.for(this)
    this.state = getInitialState(parents, config.batchSize)
    this.parents.forEach((parent, index) => {
      this.logger.debug('Subscribing to parent', {
        parent: parent.constructor.name,
      })
      parent.subscribe((event) => {
        this.dispatch({
          type: 'ParentUpdated',
          index,
          height: event.height,
        })
      })
    })
  }

  subscribe(callback: SubscriptionCallback): Subscription {
    this.logger.debug('Someone subscribed')
    this.subscriptionCallbacks.push(callback)
    return {
      unsubscribe: (): void => {
        this.subscriptionCallbacks = this.subscriptionCallbacks.filter(
          (cb) => cb !== callback,
        )
      },
    }
  }

  start(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getHeight(): number {
    return this.state.height
  }

  getState(): BaseIndexerState {
    return this.state
  }

  private dispatch(action: BaseIndexerAction): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    this.logger.debug('Dispatching action', { action: action as any })
    const [newState, effects] = baseIndexerReducer(this.state, action)

    this.state = newState

    this.logger.debug('Dispatching effects', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      action: action as any,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      effects: effects as any,
    })
    effects.forEach((effect) => {
      switch (effect.type) {
        case 'Update':
          return void this.executeUpdate(effect)
        case 'UpdateHeight':
          return void this.executeUpdateHeight(effect)
        default:
          throw new Error('unreachable')
      }
    })
  }

  private async executeUpdate(effect: UpdateEffect): Promise<void> {
    const from = this.state.height
    const to = Math.min(from + this.state.batchSize, effect.to)
    try {
      this.dispatch({ type: 'UpdateStarted', from, to })
      await this.update(from, to)
      this.dispatch({ type: 'UpdateSucceeded', from, to })
      // @todo: children
    } catch (e) {
      // @todo: retries, back-off
      this.dispatch({ type: 'UpdateFailed', from, to })
    }
  }

  abstract setHeight(height: number): Promise<void>

  private async executeUpdateHeight(effect: UpdateHeightEffect): Promise<void> {
    this.state.height = effect.to
    await this.setHeight(effect.to)
    this.subscriptionCallbacks.forEach((callback) => {
      callback({ type: 'update', height: effect.to })
    })
  }
}
