import { Logger } from "@l2beat/backend-tools";
import { DiscoveryDiff } from "@l2beat/discovery";
import { UpdateNotifierRepository } from "../../peripherals/database/discovery/UpdateNotifierRepository";

export class FieldThrottler {
    constructor(
        private readonly updateNotifierRepository: UpdateNotifierRepository,
        private readonly logger: Logger,
    ) {
    }

    filterDiff(diff: DiscoveryDiff[]): DiscoveryDiff[] {
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
        return diff
    }
}
