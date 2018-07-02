require('@babel/register')({ cache: false })
require('@babel/polyfill')

const { IS_SSL, IS_PROD, APP_PORT, PUBLIC_URL } = require('./config/env')

const { serve } = require('./server')

serve(IS_SSL, IS_PROD, APP_PORT, PUBLIC_URL)
