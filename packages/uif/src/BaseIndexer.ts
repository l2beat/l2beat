import { Logger } from '@l2beat/backend-tools'

import { assertUnreachable } from './assertUnreachable'
import { Indexer, Subscription } from './Indexer'
import { IndexerAction } from './IndexerAction'
import {
  InvalidateEffect,
  NotifyReadyEffect,
  SetHeightEffect,
  UpdateEffect,
} from './IndexerEffect'
import { getInitialState, indexerReducer } from './indexerReducer'
import { IndexerState } from './IndexerState'
import { assert } from 'node:console'

export abstract class BaseIndexer implements Indexer {
  private children: Indexer[] = []

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

  private state: IndexerState

  constructor(protected logger: Logger, public readonly parents: Indexer[]) {
    this.logger = this.logger.for(this)
    this.state = getInitialState(parents.length)
    this.parents.forEach((parent, index) => {
      this.logger.debug('Subscribing to parent', {
        parent: parent.constructor.name,
      })
      parent.subscribe(this)
    })
  }

  async start(): Promise<void> {
    const height = await this.getHeight()
    this.dispatch({ type: 'Initialized', height })
  }

  subscribe(child: Indexer): Subscription {
    this.logger.debug('Someone subscribed')
    this.children.push(child)
    return {
      unsubscribe: (): void => {
        this.children = this.children.filter((c) => c !== child)
      },
    }
  }

  notifyReady(child: Indexer): void {
    this.logger.debug('Someone is ready', { child: child.constructor.name })
  }

  notifyUpdate(parent: Indexer, height: number): void {
    const index = this.parents.indexOf(parent)
    assert(index !== -1, 'Received update from unknown parent')
    this.dispatch({ type: 'ParentUpdated', index, height })
  }

  getState(): IndexerState {
    return this.state
  }

  private dispatch(action: IndexerAction): void {
    const [newState, effects] = indexerReducer(this.state, action)
    this.state = newState
    this.logger.debug('Dispatched', { action, newState: this.state, effects })

    // TODO: check if this doesn't result in stack overflow
    effects.forEach((effect) => {
      switch (effect.type) {
        case 'Update':
          return void this.executeUpdate(effect)
        case 'Invalidate':
          return void this.executeInvalidate(effect)
        case 'SetHeight':
          return void this.executeSetHeight(effect)
        case 'NotifyReady':
          return void this.executeNotifyReady(effect)
        default:
          return assertUnreachable(effect)
      }
    })
  }

  private async executeUpdate(effect: UpdateEffect): Promise<void> {
    const from = this.state.height
    try {
      const to = await this.update(from, effect.to)
      if (to < from || to > effect.to) {
        this.logger.error('Update returned invalid height', {
          returned: to,
          min: from,
          max: effect.to,
        })
        this.dispatch({ type: 'UpdateFailed', from, to: effect.to })
      } else {
        this.dispatch({ type: 'UpdateSucceeded', from, to })
      }
    } catch (e) {
      this.logger.error('Update failed', e)
      this.dispatch({ type: 'UpdateFailed', from, to: effect.to })
    }
  }

  private async executeInvalidate(effect: InvalidateEffect): Promise<void> {
    try {
      await this.invalidate(effect.to)
      this.dispatch({ type: 'InvalidateSucceeded', height: effect.to })
    } catch (e) {
      this.logger.error('Invalidate failed', e)
      this.dispatch({ type: 'InvalidateFailed', height: effect.to })
    }
  }

  private async executeSetHeight(effect: SetHeightEffect): Promise<void> {
    this.state.height = effect.height
    await this.setHeight(effect.height)
    this.children.forEach((child) => child.notifyUpdate(this, effect.height))
  }

  private executeNotifyReady(effect: NotifyReadyEffect): void {
    this.parents.forEach((parent, index) => {
      if (effect.parentIndices.includes(index)) {
        parent.notifyReady(this)
      }
    })
  }
}
