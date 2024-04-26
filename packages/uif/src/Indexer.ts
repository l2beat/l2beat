import { assert } from 'node:console'

import { Logger } from '@l2beat/backend-tools'

import { assertUnreachable } from './assertUnreachable'
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

export interface IndexerOptions {
  tickRetryStrategy?: RetryStrategy
  updateRetryStrategy?: RetryStrategy
  invalidateRetryStrategy?: RetryStrategy
}

export abstract class Indexer {
  private readonly children: Indexer[] = []

  /**
   * This can be overridden to provide a custom retry strategy. It will be
   * used for all indexers that don't specify their own strategy.
   * @returns A default retry strategy that will be used for all indexers
   */
  static GET_DEFAULT_RETRY_STRATEGY: () => RetryStrategy = () =>
    Retries.exponentialBackOff({
      initialTimeoutMs: 1000,
      maxAttempts: 10,
      maxTimeoutMs: 60 * 1000,
    })

  /**
   * Initializes the indexer. It should return a height that the indexer has
   * synced up to. If the indexer has not synced any data, it should return
   * `minHeight - 1`. For root indexers it should return the initial target
   * height for the entire system.
   *
   * This method is expected to read the height that was saved previously with
   * `setSafeHeight`. It shouldn't call `setSafeHeight` itself.
   *
   * For root indexers if `setSafeHeight` is implemented it should return the
   * height that was saved previously. If not it can `return this.tick()`.
   * This method should also schedule a process to request ticks. For example
   * with `setInterval(() => this.requestTick(), 1000)`.
   *
   * @returns The height that the indexer has synced up to or the target height
   * for the entire system if this is a root indexer.
   */
  abstract initialize(): Promise<number>

  /**
   * Saves the height (most likely to a database). The height given is the
   * smallest height from all parents and what the indexer itself synced to
   * previously.
   *
   * When `initialize` is called it is expected that it will read the same
   * height that was saved here.
   *
   * Optional in root indexers.
   */
  abstract setSafeHeight(height: number): Promise<void>

  /**
   * Implements the main data fetching process. It is up to the indexer to
   * decide how much data to fetch. For example given `.update(100, 200)`, the
   * indexer can only fetch data up to 110 and return 110. The next time this
   * method will be called with `.update(111, 200)`.
   *
   * @param from The height for which the indexer should start syncing data.
   * This value is inclusive.
   *
   * @param to The height at which the indexer should end syncing data. This
   * value is also inclusive so the indexer should eventually sync data for this
   * height.
   *
   * @returns The height that the indexer has synced up to. Returning
   * `from` means that the indexer has synced a single data point. Returning
   * a value greater than `from` means that the indexer has synced up
   * to that height. Returning a value less than `from` will trigger
   * invalidation down to the returned value. Returning a value greater than
   * `to` is not permitted.
   */
  abstract update(from: number, to: number): Promise<number>

  /**
   * Responsible for invalidating data that was synced previously. It is
   * possible that no data was synced and this method is still called.
   *
   * Invalidation can, but doesn't have to remove data from the database. If
   * you only want to rely on the safe height, you can just return the target
   * height and the system will take care of the rest.
   *
   * This method doesn't have to invalidate all data. If you want to do it in
   * steps, you can return a height that is larger than the target height.
   *
   * @param targetHeight The height that the indexer should invalidate down to.
   *
   * @returns The height that the indexer has invalidated down to. Returning
   * `targetHeight` means that the indexer has invalidated all the required
   * data. Returning a value greater than `targetHeight` means that the indexer
   * has invalidated down to that height.
   */
  abstract invalidate(targetHeight: number): Promise<number>

  /**
   * This method is responsible for providing the target height for the entire
   * system. Some candidates for this are: the current time or the latest block
   * number.
   */
  abstract tick(): Promise<number>

  private state: IndexerState
  private started = false
  private readonly tickRetryStrategy: RetryStrategy
  private readonly updateRetryStrategy: RetryStrategy
  private readonly invalidateRetryStrategy: RetryStrategy

  constructor(
    protected logger: Logger,
    public readonly parents: Indexer[],
    options?: IndexerOptions,
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
      options?.tickRetryStrategy ?? Indexer.GET_DEFAULT_RETRY_STRATEGY()
    this.updateRetryStrategy =
      options?.updateRetryStrategy ?? Indexer.GET_DEFAULT_RETRY_STRATEGY()
    this.invalidateRetryStrategy =
      options?.invalidateRetryStrategy ?? Indexer.GET_DEFAULT_RETRY_STRATEGY()
  }

  get safeHeight(): number {
    return this.state.safeHeight
  }

  async start(): Promise<void> {
    assert(!this.started, 'Indexer already started')
    this.started = true
    const height = await this.initialize()
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

  notifyUpdate(parent: Indexer, safeHeight: number): void {
    this.logger.debug('Someone has updated', {
      parent: parent.constructor.name,
    })
    const index = this.parents.indexOf(parent)
    assert(index !== -1, 'Received update from unknown parent')
    this.dispatch({ type: 'ParentUpdated', index, safeHeight })
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
    const from = this.state.height + 1
    this.logger.info('Updating', { from, to: effect.targetHeight })
    try {
      const newHeight = await this.update(from, effect.targetHeight)
      if (newHeight > effect.targetHeight) {
        this.logger.critical('Update returned invalid height', {
          newHeight,
          max: effect.targetHeight,
        })
        this.dispatch({ type: 'UpdateFailed', fatal: true })
      } else {
        this.dispatch({ type: 'UpdateSucceeded', from, newHeight })
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
    const timeoutMs = this.updateRetryStrategy.timeoutMs()
    this.logger.debug('Scheduling retry update', { timeoutMs })
    setTimeout(() => {
      this.dispatch({ type: 'RetryUpdate' })
    }, timeoutMs)
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
    const timeoutMs = this.invalidateRetryStrategy.timeoutMs()
    this.logger.debug('Scheduling retry invalidate', { timeoutMs })
    setTimeout(() => {
      this.dispatch({ type: 'RetryInvalidate' })
    }, timeoutMs)
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
    const timeoutMs = this.tickRetryStrategy.timeoutMs()
    this.logger.debug('Scheduling retry tick', { timeoutMs })
    setTimeout(() => {
      this.dispatch({ type: 'RetryTick' })
    }, timeoutMs)
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
