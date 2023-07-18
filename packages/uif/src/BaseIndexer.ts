import { assert } from 'node:console'

import { Logger } from '@l2beat/backend-tools'

import { assertUnreachable } from './assertUnreachable'
import { Indexer } from './Indexer'
import { IndexerAction } from './IndexerAction'
import {
  InvalidateEffect,
  NotifyReadyEffect,
  SetSafeHeightEffect,
  UpdateEffect,
} from './IndexerEffect'
import { getInitialState, indexerReducer } from './indexerReducer'
import { IndexerState } from './IndexerState'

export abstract class BaseIndexer implements Indexer {
  private readonly children: Indexer[] = []

  /**
   * Should read the height from the database. It must return a height, so
   * if database is empty a fallback value has to be chosen.
   */
  abstract getSafeHeight(): Promise<number>

  /**
   * Should write the height to the database. The height given is the most
   * pessimistic value and the indexer is expected to actually operate at a
   * higher height in runtime.
   */
  abstract setSafeHeight(height: number): Promise<void>

  /**
   * To be used in ChildIndexer.
   *
   * @param from - current height of the indexer, exclusive
   * @param to - inclusive
   */
  abstract update(from: number, to: number): Promise<number>

  /**
   * Only to be used in RootIndexer. It provides a way to start the height
   * update process.
   */
  abstract tick(): Promise<number>

  /**
   * @param targetHeight - every value > `targetHeight` is invalid, but `targetHeight` itself is valid
   */
  // TODO: This function can return Promise<number>
  abstract invalidate(targetHeight: number): Promise<void>

  private state: IndexerState
  private started = false

  constructor(protected logger: Logger, public readonly parents: Indexer[]) {
    this.logger = this.logger.for(this)
    this.state = getInitialState(parents.length)
    this.parents.forEach((parent) => {
      this.logger.debug('Subscribing to parent', {
        parent: parent.constructor.name,
      })
      parent.subscribe(this)
    })
  }

  async start(): Promise<void> {
    assert(!this.started, 'Indexer already started')
    this.started = true
    const height = await this.getSafeHeight()
    this.dispatch({
      type: 'Initialized',
      safeHeight: height,
      childCount: this.children.length,
    })
  }

  subscribe(child: Indexer): void {
    assert(!this.started, 'Indexer already started')
    this.logger.debug('Child subscribed', { child: child.constructor.name })
    this.children.push(child)
  }

  notifyReady(child: Indexer): void {
    this.logger.debug('Someone is ready', { child: child.constructor.name })
    const index = this.children.indexOf(child)
    assert(index !== -1, 'Received ready from unknown child')
    this.dispatch({ type: 'ChildReady', index })
  }

  notifyUpdate(parent: Indexer, to: number): void {
    const index = this.parents.indexOf(parent)
    assert(index !== -1, 'Received update from unknown parent')
    this.dispatch({ type: 'ParentUpdated', index, safeHeight: to })
  }

  getState(): IndexerState {
    return this.state
  }

  private dispatch(action: IndexerAction): void {
    const [newState, effects] = indexerReducer(this.state, action)
    this.state = newState
    this.logger.debug('Action', { action })
    this.logger.trace('State', { state: newState, effects })

    // TODO: check if this doesn't result in stack overflow
    effects.forEach((effect) => {
      switch (effect.type) {
        case 'Update':
          return void this.executeUpdate(effect)
        case 'Invalidate':
          return void this.executeInvalidate(effect)
        case 'SetSafeHeight':
          return void this.executeSetSafeHeight(effect)
        case 'NotifyReady':
          return this.executeNotifyReady(effect)
        case 'Tick':
          return void this.executeTick()
        default:
          return assertUnreachable(effect)
      }
    })
  }

  // #region Child methods

  private async executeUpdate(effect: UpdateEffect): Promise<void> {
    // TODO: maybe from should be inclusive?
    const from = this.state.height
    try {
      const to = await this.update(from, effect.targetHeight)
      if (to > effect.targetHeight) {
        this.logger.error('Update returned invalid height', {
          returned: to,
          max: effect.targetHeight,
        })
        this.dispatch({
          type: 'UpdateFailed',
          from,
          targetHeight: effect.targetHeight,
        })
      } else {
        this.dispatch({ type: 'UpdateSucceeded', from, targetHeight: to })
      }
    } catch (e) {
      this.logger.error('Update failed', e)
      this.dispatch({
        type: 'UpdateFailed',
        from,
        targetHeight: effect.targetHeight,
      })
    }
  }

  private executeNotifyReady(effect: NotifyReadyEffect): void {
    this.parents.forEach((parent, index) => {
      if (effect.parentIndices.includes(index)) {
        parent.notifyReady(this)
      }
    })
  }

  // #endregion
  // #region Root methods

  private async executeTick(): Promise<void> {
    try {
      const safeHeight = await this.tick()
      this.dispatch({ type: 'TickSucceeded', safeHeight })
    } catch (e) {
      this.logger.error('Tick failed', e)
      this.dispatch({ type: 'TickFailed' })
    }
  }

  /**
   * Requests the tick function to be called. Repeated calls will result in
   * only one tick. Only when the tick is finished, the next tick will be
   * scheduled.
   */
  protected requestTick(): void {
    this.dispatch({ type: 'RequestTick' })
  }

  // #endregion
  // #region Common methods

  private async executeInvalidate(effect: InvalidateEffect): Promise<void> {
    try {
      await this.invalidate(effect.targetHeight)
      this.dispatch({
        type: 'InvalidateSucceeded',
        targetHeight: effect.targetHeight,
      })
    } catch (e) {
      this.logger.error('Invalidate failed', e)
      this.dispatch({
        type: 'InvalidateFailed',
        targetHeight: effect.targetHeight,
      })
    }
  }

  private async executeSetSafeHeight(
    effect: SetSafeHeightEffect,
  ): Promise<void> {
    this.children.forEach((child) =>
      child.notifyUpdate(this, effect.safeHeight),
    )
    await this.setSafeHeight(effect.safeHeight)
  }

  // #endregion
}

export abstract class RootIndexer extends BaseIndexer {
  constructor(logger: Logger) {
    super(logger, [])
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async update(): Promise<number> {
    throw new Error('RootIndexer cannot update')
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async invalidate(): Promise<void> {
    throw new Error('RootIndexer cannot invalidate')
  }

  override async getSafeHeight(): Promise<number> {
    return this.tick()
  }

  override async setSafeHeight(): Promise<void> {
    return Promise.resolve()
  }
}

export abstract class ChildIndexer extends BaseIndexer {
  // eslint-disable-next-line @typescript-eslint/require-await
  override async tick(): Promise<number> {
    throw new Error('ChildIndexer cannot tick')
  }
}
