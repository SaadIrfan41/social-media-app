import { ApolloClient, InMemoryCache } from '@apollo/client'
import { relayStylePagination } from '@apollo/client/utilities'

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  ssrMode: true,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allPaginatedPosts: {
            keyArgs: false,
            merge(existing, incoming) {
              if (!incoming) return existing
              if (!existing) return incoming // existing will be empty the first time

              const { posts, ...rest } = incoming
              console.log('REST', rest)

              let result = rest
              result.posts = [...existing.posts, ...posts] // Merge existing items with the items from incoming

              return result
            },
          },
        },
      },
    },
  }),
})

export default client
