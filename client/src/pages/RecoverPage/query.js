import { gql } from 'graphql.macro';

export const CREATE_TOKEN = gql`
  mutation CreateToken($phone: String!, $password: String!, $email: String!) {
    createToken(phone: $phone, password: $password, email: $email) {
      token
    }
  }
`;
