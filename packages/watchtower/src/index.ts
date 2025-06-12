import { getConfig } from './config/config'
import { Application } from './application'

const config = getConfig()
const app = new Application(config)
app.start()
