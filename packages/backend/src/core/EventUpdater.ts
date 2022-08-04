import { EtherscanClient, Logger, Project } from "@l2beat/common";

const SEVEN_DAYS = 7 * 24 * 60 * 60

export class EventUpdater {
    constructor(
        private etherscan: EtherscanClient,
        private projects: Project[],
        private logger: Logger,
        private offset = SEVEN_DAYS
    ) {
        this.logger = this.logger.for(this)
    }

    update() {
        const events = this.projects.map(p => p)
    }
}