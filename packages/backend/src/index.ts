import { Application } from './Application'
import { getConfig } from './config'

const config = getConfig('local')
const app = new Application(config)
app.start()
