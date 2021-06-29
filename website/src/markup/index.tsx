import fsx from 'fs-extra'
import path from 'path'
import { renderToStaticMarkup } from 'react-dom/server'
import { Home } from './pages/Home'

const page = renderToStaticMarkup(<Home />)
const html = `<!DOCTYPE html>${page}`
fsx.mkdirpSync('build')
fsx.writeFileSync(path.join('build', 'index.html'), html)
