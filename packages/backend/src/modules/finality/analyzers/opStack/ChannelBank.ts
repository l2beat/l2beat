import type { Logger } from '@l2beat/backend-tools'
import { assert, type ProjectId } from '@l2beat/shared-pure'

const ChannelTimeoutBlocks = 300

export interface Frame {
  frameData: Uint8Array
  channelId: channelId
  isLast: boolean
  frameNumber: number
}

type channelId = string

export class ChannelBank {
  // TODO: channels should be saved to the db so they're persistent
  // https://linear.app/l2beat/issue/L2B-4596/decode-the-proper-channel-data-for-opstack
  // In the opStack spec, channels are recorded in FIFO order in a structure called the channel queue.
  // A channel is added to the channel queue the first time a frame belonging to the channel is seen.
  // Because we do not look at all the transactions from opStack chains, we ignore this FIFO assumption (could be improved)
  // This change would require tracking all the transactions from the opStack chains, which can be a lot of data
  // but it would allow us to reconstruct the channels in the correct order.

  private readonly channels = new Map<channelId, Channel>()

  constructor(
    private readonly projectId: ProjectId,
    private readonly logger: Logger,
  ) {}

  /**
   * This function will add frames from a single transaction to the channel.
   * It will return a channel if the frames array is not full (last )
   *
   * @param frames frames to add to the channel. All frames should be from the same channel
   * @returns closed channel or null
   */
  addFramesToChannel(frames: Frame[], blockNumber: number): Channel | null {
    this.dropOutdatedChannels(blockNumber)

    const channelIds = new Set(frames.map((f) => f.channelId))
    assert(
      channelIds.size === 1,
      'All frames should belong to the same channel',
    )
    const channelId = frames[0].channelId

    let channel = this.channels.get(channelId)
    if (!channel) {
      channel = new Channel(channelId, blockNumber, this.projectId, this.logger)
      this.channels.set(channelId, channel)
    }

    channel.addFrames(frames)

    if (channel.isIgnored) {
      this.channels.delete(channelId)
      return null
    }

    if (channel.isClosed) {
      this.channels.delete(channelId)
      return channel
    }

    return null
  }

  private dropOutdatedChannels(blockNumber: number) {
    for (const channel of this.channels.values()) {
      if (blockNumber - channel.l1Origin > ChannelTimeoutBlocks) {
        this.channels.delete(channel.channelId)
      }
    }
  }
}

export class Channel {
  private readonly frames: Frame[] = []
  public isClosed = false
  // Ignore channels that we cannot assemble because we don't have all the frames
  public isIgnored = false

  constructor(
    readonly channelId: channelId,
    readonly l1Origin: number,
    projectId: ProjectId,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.tag({
      tag: `${projectId}:${this.l1Origin}`,
      project: projectId,
    })
  }

  addFrames(newFrames: Frame[]) {
    assert(newFrames.length > 0, 'No frames to add')
    try {
      for (const nextFrame of newFrames) {
        this.addNextFrame(nextFrame)
      }
    } catch (error) {
      this.logger.debug('Ignoring channel because of error', {
        error,
      })
      this.isIgnored = true
    }
  }

  private addNextFrame(frame: Frame) {
    assert(frame.channelId === this.channelId, 'Invalid channelId')
    assert(!this.isClosed, 'Channel is closed, cannot add frames')

    const previousFrame = this.frames.at(-1)
    if (!previousFrame) {
      assert(frame.frameNumber === 0, 'First frame is not zero number!')
    } else {
      assert(
        frame.frameNumber === previousFrame.frameNumber + 1,
        'Frames out of order!',
      )
    }

    this.frames.push(frame)
    assert(this.frames.length - 1 === frame.frameNumber, 'Wrong frames length')
    if (frame.isLast) {
      this.isClosed = true
    }
  }

  assemble() {
    assert(this.isClosed, 'Cannot assemble open channel')

    const dataLength = this.frames.reduce(
      (acc, frame) => acc + frame.frameData.length,
      0,
    )
    const data = new Uint8Array(dataLength)
    let offset = 0
    for (const frame of this.frames) {
      data.set(frame.frameData, offset)
      offset += frame.frameData.length
    }
    return data
  }
}
