import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import NextNprogress from 'nextjs-progressbar'
import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify'
import { ApolloProvider } from '@apollo/client'
import client from '../utils/apollo'

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider refetchInterval={5 * 60}>
        <NextNprogress
          color='#4F46E5'
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ToastContainer
          // style={{ zIndex: 9999 }}
          // className='!z-50'
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </SessionProvider>
    </ApolloProvider>
  )
}

export default MyApp
