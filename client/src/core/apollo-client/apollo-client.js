import {
  ApolloClient
} from 'apollo-client'
import {
  InMemoryCache
} from 'apollo-cache-inmemory'
import {
  createUploadLink
} from 'apollo-upload-client'
import {
  onError
} from 'apollo-link-error'
import {
  setContext
} from 'apollo-link-context'
import {
  ApolloLink
} from 'apollo-link'
import _ from 'lodash'

import {
  MutationResolver,
  QueryResolver
} from './local-resolvers'
import {
  GET_USER
} from '../Routes/queries'

const cache = new InMemoryCache()

const logErrors = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        '[GraphQL error]: Message: ',
        message,
        ', Location: ',
        locations,
        ', Path: ',
        path
      )
    )
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

const uploadLink = createUploadLink({
  uri: '/api/graphql'
})

const withToken = setContext((_, previousContext) => {
  let token = localStorage.getItem('token')

  return {
    ...previousContext,
    headers: {
      ...(previousContext && previousContext.headers),
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const resetTokenOnUnauthorized = onError(({ graphQLErrors, operation }) => {
  if (graphQLErrors && _.some(graphQLErrors, (e) => e.extensions && e.extensions.forbidden)) {
    if (operation.operationName !== _.get(GET_USER, 'definitions[0].name.value')) {
      // So we don't reset the store when it's not necessary
      if (localStorage.getItem('token')) {
        client.resetStore()
      }
    }
    localStorage.removeItem('token')
  }
})

const client = new ApolloClient({
  cache,
  link: ApolloLink.from(_.compact([
    withToken,
    resetTokenOnUnauthorized,
    process.env.NODE_ENV === 'development' ? logErrors : null,
    uploadLink
  ])),
  resolvers: { Query: QueryResolver, Mutation: MutationResolver }
})

export default client
