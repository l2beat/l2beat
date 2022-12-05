import { config } from 'dotenv'
import waitForExpect from 'wait-for-expect'

config()

process.env.NODE_ENV = 'test'

waitForExpect.defaults.timeout = 1500
waitForExpect.defaults.interval = 10
