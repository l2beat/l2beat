import { Logger } from '@l2beat/backend-tools'

import { BaseIndexerAction } from './BaseIndexerAction'
import { BaseIndexerState } from './BaseIndexerState'
import { InvalidateEffect, UpdateEffect, UpdateHeightEffect } from './Effect'
import { Indexer, Subscription, SubscriptionCallback } from './Indexer'
import { baseIndexerReducer, getInitialState } from './reducer'

export abstract class BaseIndexer implements Indexer {
  private subscriptionCallbacks: SubscriptionCallback[] = []

  /**
   * Should read the height from the database. It must return a height, so
   * if database is empty a fallback value has to be chosen.
   */
  abstract getHeight(): Promise<number>

  /**
   * Should write the height to the database. The height given is the most
   * pessimistic value and the indexer is expected to actually operate at a
   * higher height in runtime.
   */
  abstract setHeight(height: number): Promise<void>

  /**
   * @param from - inclusive
   * @param to - inclusive
   */
  abstract update(from: number, to: number): Promise<number>

  /**
   * @param to - every value > `to` is invalid, but `to` itself is valid
   */
  abstract invalidate(to: number): Promise<void>

  private state: BaseIndexerState

  constructor(protected logger: Logger, public readonly parents: Indexer[]) {
    this.logger = this.logger.for(this)
    this.state = getInitialState(parents.length)
    this.parents.forEach((parent, index) => {
      this.logger.debug('Subscribing to parent', {
        parent: parent.constructor.name,
      })
      parent.subscribe((event) =>
        this.dispatch({
          type: 'ParentUpdated',
          index,
          height: event.height,
        }),
      )
    })
  }

  async start(): Promise<void> {
    const height = await this.getHeight()
    this.dispatch({ type: 'Initialized', height })
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

  getState(): BaseIndexerState {
    return this.state
  }

  private dispatch(action: BaseIndexerAction): void {
    const [newState, effects] = baseIndexerReducer(this.state, action)
    this.logger.debug('New state', { action, state: this.state, effects })

    this.state = newState

    effects.forEach((effect) => {
      switch (effect.type) {
        case 'Update':
          return void this.executeUpdate(effect)
        case 'Invalidate':
          return void this.executeInvalidate(effect)
        case 'UpdateHeight':
          return void this.executeUpdateHeight(effect)
        default:
          console.log(effect)
          throw new Error('unreachable')
      }
    })
  }

  private async executeUpdate(effect: UpdateEffect): Promise<void> {
    const from = this.state.height
    try {
      const to = await this.update(from, effect.to)
      if (to > effect.to) {
        this.logger.error('Indexer returned invalid height', {
          returned: to,
          expected: effect.to,
        })
        // TODO: invalidate in reducer
      }
      this.dispatch({ type: 'UpdateSucceeded', from, to })
    } catch (e) {
      this.logger.error('Failed to update', e)
      // @todo: retries, back-off
      this.dispatch({ type: 'UpdateFailed', from, to: effect.to })
    }
  }

  private async executeInvalidate(effect: InvalidateEffect): Promise<void> {
    try {
      await this.invalidate(effect.to)
      this.dispatch({ type: 'InvalidateSucceeded', height: effect.to })
    } catch (e) {
      this.logger.error('Failed to invalidate', e)
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
