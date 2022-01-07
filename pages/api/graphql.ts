import { ApolloServer, AuthenticationError } from 'apollo-server-micro'

import typeDefs from '../../mongo/graphql/typeDefs'
import resolvers from '../../mongo/graphql/resolvers'
import connectDb from '../../mongo/config'
import { MicroRequest } from 'apollo-server-micro/dist/types'
import { ServerResponse } from 'http'
import { getSession } from 'next-auth/react'

connectDb()

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const session = await getSession({ req })
    // return { session }
    // if (!session) {
    //   throw new AuthenticationError('User is not logged in.')
    // }
    return { session }
  },
})

const startServer = apolloServer.start()

export default async function handler(req: MicroRequest, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
