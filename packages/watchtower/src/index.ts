import { Application } from './application'
import { getConfig } from './config/config'

const config = getConfig()
const app = new Application(config)
app.start()
