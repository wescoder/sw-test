const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin-loader')
const mkdirp = require('mkdirp')
const { DefinePlugin } = require('webpack')
const { resolve } = require('path')

const paths = require('./config/paths')
const ENV = require('./config/env')
const { ANALYZE } = process.env

let config = {
  serverRuntimeConfig: { ...ENV },
  publicRuntimeConfig: { ...ENV },
  webpack (config, { dev, buildId/* , isServer, defaultLoaders */ }) {
    config.plugins.push(new DefinePlugin({
      'process.env': JSON.stringify(ENV)
    }))

    const SW_PATH = resolve('./.next/static')
    mkdirp(SW_PATH) // ensure the folder exists before next creates it otherwise sw-precache will break the build

    config.plugins.push(new SWPrecacheWebpackPlugin({
      cacheId: 'sw-test',
      filepath: `${SW_PATH}/sw.js`,
      minify: true,
      navigateFallback: ENV.PUBLIC_URL,
      mergeStaticsConfig: false,
      handleFetch: !dev,
      staticFileGlobs: [
        '.next/bundles/**/*.js',
        '.next/static/**/*.{js,css,jpg,jpeg,png,svg,gif}'
      ],
      staticFileGlobsIgnorePatterns: [/_.*\.js$/, /\.map/],
      stripPrefixMulti: {
        '.next/bundles/pages/': `/_next/${buildId}/page/`,
        '.next/static/': '/_next/static/'
      },
      runtimeCaching: [
        { handler: 'fastest', urlPattern: /[.](jpe?g|png|svg|gif)/ },
        { handler: 'networkFirst', urlPattern: /^https.*(js|css)/ }
      ],
      templateFilePath: resolve('./components/service-worker.js.ejs'),
      verbose: true
    }))

    if (!dev) {
      config.devtool = 'source-map'
    }

    config.resolve.alias['@components'] = paths.appComponents
    config.resolve.alias['@reducers'] = paths.appReducers
    config.resolve.alias['@pages'] = paths.appPages
    config.resolve.alias['@root'] = paths.appRoot

    return config
  }
}

module.exports = config
