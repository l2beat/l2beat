import { config as dotenv } from 'dotenv'

dotenv()

interface Config {
  alchemyApiKey?: string
}

export const config: Config = {
  alchemyApiKey:
    process.env.CONFIG_ALCHEMY_API_KEY ?? 'mlGD422scpwVOpn3lye_swHEebbKQy0D',
}
