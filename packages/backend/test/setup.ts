import waitForExpect from 'wait-for-expect'
import { config } from 'dotenv'

config()

process.env.NODE_ENV = 'test'

waitForExpect.defaults.timeout = 1500
waitForExpect.defaults.interval = 10
