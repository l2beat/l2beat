import waitForExpect from 'wait-for-expect'

process.env.NODE_ENV = 'test'

waitForExpect.defaults.timeout = 1500
waitForExpect.defaults.interval = 10
