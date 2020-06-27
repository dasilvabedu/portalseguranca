import { gql } from 'graphql.macro';

export const GET_ALL_DOCUMENTS = gql`
  {
    allDocuments {
      id
      name
      description
      type
      url
    }
  }
`;
