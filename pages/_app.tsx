import '../styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'

const App = ({ Component, pageProps }: AppProps) =>
  <>
    <Head>
      <title>GLSL Shader EXPs</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </>

export default App