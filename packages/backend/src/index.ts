import Router from '@koa/router'
import Koa from 'koa'

const app = new Koa()
const router = new Router()

router.get('/', (ctx) => {
  ctx.body = 'Hello World'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
