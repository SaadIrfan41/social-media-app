import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  ssrMode: true,
  cache: new InMemoryCache(),
})

export default client
