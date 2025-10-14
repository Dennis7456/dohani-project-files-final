import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// Create HTTP link to Hygraph
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_HYGRAPH_ENDPOINT || 'https://your-hygraph-endpoint.hygraph.com/v2/your-project-id/master',
})

// Create auth link for Hygraph token
const authLink = setContext((_, { headers }) => {
  const token = import.meta.env.VITE_HYGRAPH_TOKEN
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

// Create Apollo Client
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          medicalServices: {
            merge(existing = [], incoming) {
              return incoming
            }
          },
          newsArticles: {
            merge(existing = [], incoming) {
              return incoming
            }
          },
          messages: {
            merge(existing = [], incoming) {
              return incoming
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
})