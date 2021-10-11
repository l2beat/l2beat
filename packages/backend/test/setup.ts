import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import waitForExpect from 'wait-for-expect'

process.env.NODE_ENV = 'test'

chai.use(chaiAsPromised)

waitForExpect.defaults.timeout = 1500
waitForExpect.defaults.interval = 10
