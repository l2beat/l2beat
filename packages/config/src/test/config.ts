import { config as dotenv } from 'dotenv'

dotenv()

interface Config {
  alchemyApiKey?: string
}

export const config: Config = {
  alchemyApiKey:
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    process.env.CONFIG_ALCHEMY_API_KEY || 'mlGD422scpwVOpn3lye_swHEebbKQy0D',
}
