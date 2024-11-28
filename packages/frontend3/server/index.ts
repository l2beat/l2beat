import { Application } from './Application'
import { getConfig } from './config/getConfig'

const config = getConfig()
const app = new Application(config)
app.start()
