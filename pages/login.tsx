import Login from '../components/Login'

import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

const register = () => {
  return (
    <div>
      <Login />
    </div>
  )
}

export default register

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
