import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { globalConfig } from '../config'

export const nftfyClient = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: new HttpLink({
    uri: globalConfig.nftfy.api.base
  }),
  cache: new InMemoryCache({}),
  connectToDevTools: true
})

export const theGraphClient = (uri: string) => {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {}
      }
    }
  })

  return new ApolloClient({
    uri,
    cache
  })
}
