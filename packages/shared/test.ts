import chalk from 'chalk';
import { CliLogger } from './src/tools/CliLogger'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const logger = new CliLogger()
async function main(): Promise<void> {
    const elements: string[] = [
        "When", "most", "I", "wink", "then", "do", "mine", "eyes", "best", "see",
        "For", "all", "the", "day", "they", "view", "things", "unrespected",
        "But", "when", "I", "sleep", "in", "dreams", "they", "look", "on", "thee",
        "And", "darkly", "bright", "are", "bright", "in", "dark", "directed"
    ];

    const statusLineId = logger.createStatus()
    for(const element of elements) {
        logger.logLine("hi hya")
        logger.updateStatus(statusLineId, chalk.red(element))
        await wait(50)
    }
}

main().catch()
