import App, { Container } from 'next/app'

import register from '@components/register-sw.js'

class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    return { pageProps }
  }

  componentDidMount () {
    register(global)
  }

  render () {
    const { Component, store, pageProps = {} } = this.props

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
