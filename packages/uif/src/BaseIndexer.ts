import { Logger } from '@l2beat/backend-tools'

import { BaseIndexerAction } from './BaseIndexerAction'
import { BaseIndexerState } from './BaseIndexerState'
import { InvalidateEffect, UpdateEffect, UpdateHeightEffect } from './Effect'
import { Indexer, Subscription, SubscriptionCallback } from './Indexer'
import { baseIndexerReducer, getInitialState } from './reducer'

export abstract class BaseIndexer implements Indexer {
  private subscriptionCallbacks: SubscriptionCallback[] = []

  /**
   * @param from - inclusive
   * @param to - inclusive
   */
  abstract update(from: number, to: number): Promise<number>

  /**
   * @param to - every value > `to` is invalid, but `to` itself is valid
   */
  abstract invalidate(to: number): Promise<void>

  abstract setHeight(height: number): Promise<void>

  private state: BaseIndexerState

  constructor(protected logger: Logger, public readonly parents: Indexer[]) {
    this.logger = this.logger.for(this)
    this.state = getInitialState(parents)
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

  private effectCount = 0
  private dispatch(action: BaseIndexerAction): void {
    if (this.effectCount > 10) {
      this.logger.error('Too many effects')
      return
    }

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
      // @todo: retries, back-off
      this.dispatch({ type: 'UpdateFailed', from, to: effect.to })
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
