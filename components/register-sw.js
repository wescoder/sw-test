import getConfig from 'next/config'

const { publicRuntimeConfig: { IS_SSL, PUBLIC_URL } = {} } = getConfig() || {}

export const register = ({ location, navigator, addEventListener } = {}) => {
  function registerValidSW (swUrl) {
    navigator.serviceWorker
      .register(swUrl, {
        scope: '/'
      })
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // At this point, the old content will have been purged and
                // the fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in your web app.
                console.info('New content is available; please refresh.')
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a
                // "Content is cached for offline use." message.
                console.info('Content is cached for offline use.')
              }
            } else {
              console.info(`Service worker state: ${installingWorker.state}`)
            }
          }
        }
      })
      .catch(error => {
        console.error('Error during service worker registration:', error)
      })
  }

  function checkValidServiceWorker (swUrl) {
    console.log('swUrl:', swUrl)
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl)
      .then(response => {
        // Ensure service worker exists, and that we really are getting a JS file.
        if (
          response.status === 404
          || response.headers.get('content-type').indexOf('javascript') === -1
        ) {
          // No service worker found. Probably a different app. Reload the page.
          navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
              location.reload()
            })
          })
        } else {
          // Service worker found. Proceed as normal.
          registerValidSW(swUrl)
        }
      })
      .catch(() => {
        console.warn('No internet connection found. App is running in offline mode.')
      })
  }

  if (location && IS_SSL && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(PUBLIC_URL, location)
    if (!/^https/.test(location.origin) || publicUrl.origin !== location.origin) {
      // Our service worker won't work if publicUrl is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
      return
    }

    const isLocalhost = Boolean(
      location.hostname === 'localhost'
        // [::1] is the IPv6 localhost address.
        || location.hostname === '[::1]'
        // 127.0.0.1/8 is considered localhost for IPv4.
        || location.hostname.match(
          /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
    )

    addEventListener('load', () => {
      const swUrl = `${PUBLIC_URL}/sw.js`

      if (isLocalhost) {
        // This is running on localhost. Lets check if a service worker still exists or not.
        checkValidServiceWorker(swUrl)

        // Add some additional infoging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.info('This web app is being served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ')
        })
      } else {
        // Is not local host. Just register service worker
        registerValidSW(swUrl)
      }
    })
  }
}

export const unregister = ({ navigator }) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister()
    })
  }
}

export default register
