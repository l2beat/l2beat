import { Logger } from '@l2beat/backend-tools'
import { DiscoveryDiff } from '@l2beat/discovery'
import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { UpdateNotifierRepository } from '../../peripherals/database/discovery/UpdateNotifierRepository'

const DEFAULT_OCCURRENCE_LIMIT = 3
const DEFAULT_HOUR_RANGE = 4

export class FieldThrottler {
  constructor(
    private readonly updateNotifierRepository: UpdateNotifierRepository,
    private readonly logger: Logger,
    private readonly occurrenceLimit = DEFAULT_OCCURRENCE_LIMIT,
    private readonly hourRange = DEFAULT_HOUR_RANGE,
  ) {}

  async filterDiff(
    projectName: string,
    chainId: ChainId,
    diff: DiscoveryDiff[],
  ): Promise<DiscoveryDiff[]> {
    // NOTE(radomski): For myself tomorrow, the idea behind this is
    // to get the diffs saved for a project/chainId combo. Get the last 3
    // diffs, if the time difference between the first and last diff is
    // less than 4 hours, throttle values that are recurring in those three
    // diffs. This is because in the UpdateNoitiferRepository we never
    // overwrite. Everything is appended so we know the entire history of
    // the diffs sent. Thus we can track any things that start to act
    // irrationally.
    //
    // There are some problems, like the fact that we rely on the
    // UpdateNotifierRepository already having that diff that we want to
    // throttle. The best idea to be secure any potential changes in the
    // future is to write a test that will prevent any code changes that
    // change the order. We might even put in an assert that checks if the
    // last diff from the database matches the one that is sent to us.
    //
    // Maybe just insert into the database here? Fixes the check, and still
    // only one place where everything is stored.

    const timeFence = UnixTime.now().add(-this.hourRange, 'hours')
    const previousRecords = await this.updateNotifierRepository.getNewerThan(
      timeFence,
      projectName,
      chainId,
    )
    const previousDiffs = previousRecords.flatMap((r) => r.diff)

    if (previousDiffs.length < this.occurrenceLimit) {
      return diff
    }

    const counts = this.countFieldOccurrencesInDiffs(previousDiffs)
    const filteredInside = diff.map((d) => {
      if (d.diff === undefined) {
        return d
      }

      return {
        ...d,
        diff: d.diff.filter((field) => {
          if (field.key === undefined) {
            return field
          }

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          const count = counts[this.getFieldKey(d.address, field.key)] ?? 0
          return count < this.occurrenceLimit
        }),
      }
    })

    return filteredInside.filter((d) => {
      if (d.diff === undefined) {
        return true
      }

      return d.diff.length !== 0
    })
  }

  private countFieldOccurrencesInDiffs(diffs: DiscoveryDiff[]) {
    const result: Record<string, number> = {}

    for (const diff of diffs) {
      if (diff.diff === undefined) {
        continue
      }

      for (const field of diff.diff) {
        if (field.key === undefined) {
          continue
        }

        const key = this.getFieldKey(diff.address, field.key)
        result[key] ??= 0
        result[key] += 1
      }
    }

    return result
  }

  private getFieldKey(address: EthereumAddress, fieldKey: string): string {
    return `${address.toString()}:${fieldKey}`
  }
}
