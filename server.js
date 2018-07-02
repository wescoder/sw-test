import next from 'next'
import { certificateFor } from 'devcert'
import { createServer as prodServer } from 'http'
import { createServer as devServer } from 'https'
import { resolve } from 'path'
import { parse } from 'url'
import { promisify } from 'util'

import { IS_SSL, IS_PROD, APP_PORT, APP_DOMAIN, PUBLIC_URL, NOW_URL } from './config/env'

export const serve = async (isSSL = IS_SSL, isProd = IS_PROD, port = APP_PORT, appUrl = NOW_URL || PUBLIC_URL) => {
  const app = next({ dev: !isProd })
  const handle = app.getRequestHandler()
  const staticRoutes = ['/sw.js']

  const serverHandler = (req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl

    if (staticRoutes.includes(pathname)) {
      const filePath = resolve(`.next/static${pathname}`)
      console.log(filePath)

      app.serveStatic(req, res, filePath)
    } else {
      handle(req, res, parsedUrl)
    }
  }

  let server

  await app.prepare()

  if (!isSSL) {
    console.log('>> Running in production mode.')
    server = prodServer(serverHandler)
  } else {
    console.log('>> Running in development mode.')
    server = devServer(await certificateFor(APP_DOMAIN), serverHandler)
  }

  const listen = promisify(server.listen).bind(server)
  await listen(port)

  console.log(`>> Ready on: ${appUrl}`)

  const close = async () => {
    await server.close()

    console.log('>> Server stopped sucessfully')
    process.exit(0)
  }

  process.on('exit', code => console.log(`>> Server exiting with code: ${code}`))
  process.on('SIGINT', close)
  process.on('SIGTERM', close)
  process.on('SIGUSR1', close)
  process.on('SIGUSR2', close)
  process.on('uncaughtException', close)

  return server
}

export default serve
