import { gql } from 'graphql.macro'

export const GET_USER_ID = gql`
  query GetUserID {
    currentUserId @client
  }
`

export const GET_USER = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      name
      profile
    }
  }
`
