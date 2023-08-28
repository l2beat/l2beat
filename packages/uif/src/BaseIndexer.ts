import { assert } from 'node:console'

import { Logger } from '@l2beat/backend-tools'

import { assertUnreachable } from './assertUnreachable'
import { Indexer } from './Indexer'
import { getInitialState } from './reducer/getInitialState'
import { indexerReducer } from './reducer/indexerReducer'
import { IndexerAction } from './reducer/types/IndexerAction'
import {
  InvalidateEffect,
  NotifyReadyEffect,
  SetSafeHeightEffect,
  UpdateEffect,
} from './reducer/types/IndexerEffect'
import { IndexerState } from './reducer/types/IndexerState'
import { Retries, RetryStrategy } from './Retries'

export abstract class BaseIndexer implements Indexer {
  private readonly children: Indexer[] = []

  static DEFAULT_RETRY_STRATEGY = Retries.exponentialBackOff({
    initialTimeoutMs: 1000,
    maxAttempts: 10,
    maxTimeoutMs: 60 * 1000,
  })

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
  abstract invalidate(targetHeight: number): Promise<number>

  private state: IndexerState
  private started = false
  private readonly tickRetryStrategy: RetryStrategy
  private readonly updateRetryStrategy: RetryStrategy
  private readonly invalidateRetryStrategy: RetryStrategy

  constructor(
    protected logger: Logger,
    public readonly parents: Indexer[],
    opts?: {
      tickRetryStrategy?: RetryStrategy
      updateRetryStrategy?: RetryStrategy
      invalidateRetryStrategy?: RetryStrategy
    },
  ) {
    this.logger = this.logger.for(this)
    this.state = getInitialState(parents.length)
    this.parents.forEach((parent) => {
      this.logger.debug('Subscribing to parent', {
        parent: parent.constructor.name,
      })
      parent.subscribe(this)
    })

    this.tickRetryStrategy =
      opts?.tickRetryStrategy ?? BaseIndexer.DEFAULT_RETRY_STRATEGY
    this.updateRetryStrategy =
      opts?.updateRetryStrategy ?? BaseIndexer.DEFAULT_RETRY_STRATEGY
    this.invalidateRetryStrategy =
      opts?.invalidateRetryStrategy ?? BaseIndexer.DEFAULT_RETRY_STRATEGY
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
    this.logger.debug('Someone has updated', {
      parent: parent.constructor.name,
    })
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
        case 'ScheduleRetryUpdate':
          return this.executeScheduleRetryUpdate()
        case 'ScheduleRetryInvalidate':
          return this.executeScheduleRetryInvalidate()
        case 'ScheduleRetryTick':
          return this.executeScheduleRetryTick()
        default:
          return assertUnreachable(effect)
      }
    })
  }

  // #region Child methods

  private async executeUpdate(effect: UpdateEffect): Promise<void> {
    // TODO: maybe from should be inclusive?
    const from = this.state.height
    this.logger.info('Updating', { from, to: effect.targetHeight })
    try {
      const to = await this.update(from, effect.targetHeight)
      if (to > effect.targetHeight) {
        this.logger.critical('Update returned invalid height', {
          returned: to,
          max: effect.targetHeight,
        })
        this.dispatch({ type: 'UpdateFailed', fatal: true })
      } else {
        this.dispatch({ type: 'UpdateSucceeded', from, targetHeight: to })
        this.updateRetryStrategy.clear()
      }
    } catch (e) {
      this.updateRetryStrategy.markAttempt()
      const fatal = !this.updateRetryStrategy.shouldRetry()
      if (fatal) {
        this.logger.critical('Update failed', e)
      } else {
        this.logger.error('Update failed', e)
      }
      this.dispatch({ type: 'UpdateFailed', fatal })
    }
  }

  private executeScheduleRetryUpdate(): void {
    setTimeout(() => {
      this.dispatch({ type: 'RetryUpdate' })
    }, this.updateRetryStrategy.timeoutMs())
  }

  private async executeInvalidate(effect: InvalidateEffect): Promise<void> {
    this.logger.info('Invalidating', { to: effect.targetHeight })
    try {
      const to = await this.invalidate(effect.targetHeight)
      this.dispatch({
        type: 'InvalidateSucceeded',
        targetHeight: to,
      })
      this.invalidateRetryStrategy.clear()
    } catch (e) {
      this.invalidateRetryStrategy.markAttempt()
      const fatal = !this.invalidateRetryStrategy.shouldRetry()
      if (fatal) {
        this.logger.critical('Invalidate failed', e)
      } else {
        this.logger.error('Invalidate failed', e)
      }
      this.dispatch({ type: 'InvalidateFailed', fatal })
    }
  }

  private executeScheduleRetryInvalidate(): void {
    setTimeout(() => {
      this.dispatch({ type: 'RetryInvalidate' })
    }, this.invalidateRetryStrategy.timeoutMs())
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
    this.logger.debug('Ticking')
    try {
      const safeHeight = await this.tick()
      this.dispatch({ type: 'TickSucceeded', safeHeight })
      this.tickRetryStrategy.clear()
    } catch (e) {
      this.tickRetryStrategy.markAttempt()
      const fatal = !this.tickRetryStrategy.shouldRetry()
      if (fatal) {
        this.logger.critical('Tick failed', e)
      } else {
        this.logger.error('Tick failed', e)
      }
      this.dispatch({ type: 'TickFailed', fatal })
    }
  }

  private executeScheduleRetryTick(): void {
    setTimeout(() => {
      this.dispatch({ type: 'RetryTick' })
    }, this.tickRetryStrategy.timeoutMs())
  }

  /**
   * Requests the tick function to be called. Repeated calls will result in
   * only one tick. Only when the tick is finished, the next tick will be
   * scheduled.
   */
  protected requestTick(): void {
    this.logger.trace('Requesting tick')
    this.dispatch({ type: 'RequestTick' })
  }

  // #endregion
  // #region Common methods

  private async executeSetSafeHeight(
    effect: SetSafeHeightEffect,
  ): Promise<void> {
    this.logger.info('Setting safe height', { safeHeight: effect.safeHeight })
    this.children.forEach((child) =>
      child.notifyUpdate(this, effect.safeHeight),
    )
    await this.setSafeHeight(effect.safeHeight)
  }

  // #endregion
}

export abstract class RootIndexer extends BaseIndexer {
  constructor(logger: Logger, opts?: { tickRetryStrategy?: RetryStrategy }) {
    super(logger, [], opts)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async update(): Promise<number> {
    throw new Error('RootIndexer cannot update')
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async invalidate(): Promise<number> {
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
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    logger: Logger,
    parents: Indexer[],
    opts?: {
      updateRetryStrategy?: RetryStrategy
      invalidateRetryStrategy?: RetryStrategy
    },
  ) {
    super(logger, parents, opts)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  override async tick(): Promise<number> {
    throw new Error('ChildIndexer cannot tick')
  }
}
