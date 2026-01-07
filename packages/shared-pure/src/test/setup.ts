import waitForExpect from 'wait-for-expect'

process.env.NODE_ENV = 'test'

// @ts-expect-error - defaults is not typed
waitForExpect.defaults.timeout = 1500
// @ts-expect-error - defaults is not typed
waitForExpect.defaults.interval = 10
