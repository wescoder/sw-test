const { DefinePlugin } = require('webpack')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
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

    config.plugins.push(new SWPrecacheWebpackPlugin({
      cacheId: 'sw-test',
      filepath: resolve('./.next/static/sw.js'),
      mergeStaticsConfig: true,
      minify: true,
      navigateFallback: ENV.PUBLIC_URL,
      staticFileGlobs: [
        '.next/main.js',
        '.next/dist/bundles/**/!(_document)*.js',
        '.next/static/**/*.{js,css,jpg,jpeg,png,svg,gif}'
      ],
      staticFileGlobsIgnorePatterns: [/_.*\.js$/, /\.map/],
      stripPrefixMulti: {
        '.next/dist/bundles/pages/': `/_next/${buildId}/page/`,
        '.next/static/': '/_next/static/',
        '.next/': `/_next/${buildId}/`
      },
      runtimeCaching: [
        { handler: 'fastest', urlPattern: /[.](jpe?g|png|svg|gif)/ },
        { handler: 'networkFirst', urlPattern: /^https.*/ }
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
