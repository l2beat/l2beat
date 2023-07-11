import { Logger } from '@l2beat/backend-tools'

import { Indexer, Subscription, SubscriptionCallback } from './Indexer'
import { baseIndexerReducer, getInitialState } from './reducer'
import { BaseIndexerState } from './BaseIndexerState'
import { InvalidateEffect, UpdateEffect, UpdateHeightEffect } from './Effect'
import { BaseIndexerAction } from './BaseIndexerAction'

export abstract class BaseIndexer implements Indexer {
  private subscriptionCallbacks: SubscriptionCallback[] = []

  /**
   * @param from - inclusive
   * @param to - inclusive
   */
  abstract update(from: number, to: number): Promise<void>

  abstract invalidate(to: number): Promise<void>

  abstract setHeight(height: number): Promise<void>

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
    this.logger.debug('Dispatching action', { action })
    const [newState, effects] = baseIndexerReducer(this.state, action)

    this.state = newState

    this.logger.debug('Dispatching effects', { action, effects })
    effects.forEach((effect) => {
      switch (effect.type) {
        case 'Update':
          return void this.executeUpdate(effect)
        case 'Invalidate':
          return void this.executeInvalidate(effect)
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
      await this.update(from, to)
      this.dispatch({ type: 'UpdateSucceeded', from, to })
    } catch (e) {
      // @todo: retries, back-off
      this.dispatch({ type: 'UpdateFailed', from, to })
    }
  }

  private async executeInvalidate(effect: InvalidateEffect): Promise<void> {
    try {
      await this.invalidate(effect.to)
      this.dispatch({ type: 'InvalidateSucceeded', height: effect.to })
    } catch (e) {
      // @todo: retries, back-off
      this.dispatch({ type: 'InvalidateFailed', height: effect.to })
    }
  }

  private async executeUpdateHeight(effect: UpdateHeightEffect): Promise<void> {
    this.state.height = effect.to
    await this.setHeight(effect.to)
    this.subscriptionCallbacks.forEach((callback) => {
      callback({ type: 'update', height: effect.to })
    })
  }
}
