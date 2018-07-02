const path = require('path')
const fs = require('fs')
const url = require('url')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

require('dotenv').config({
  path: `${resolveApp('.env')}.${process.env.NODE_ENV}`
})

const { PUBLIC_URL } = process.env

function ensureSlash (path, needsSlash) {
  const hasSlash = path.endsWith('/')
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1)
  }
  if (!hasSlash && needsSlash) {
    return `${path}/`
  }
  return path
}

const getPublicUrl = appPackageJson =>
  PUBLIC_URL || require(appPackageJson).homepage

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath (appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl = url.parse(publicUrl).pathname || '/'
  return ensureSlash(servedUrl, true)
}

// Config after eject: we're in ./config/
module.exports = {
  dotenv: `${resolveApp('.env')}.${process.env.NODE_ENV}`,
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appPackageJson: resolveApp('package.json'),
  appComponents: resolveApp('components'),
  appReducers: resolveApp('reducers'),
  appPages: resolveApp('pages'),
  appRoot: appDirectory,
  appNodeModules: resolveApp('node_modules'),
  integrationPath: resolveApp('integration'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  resolveApp
}
