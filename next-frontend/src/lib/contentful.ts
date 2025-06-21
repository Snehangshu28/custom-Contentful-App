import { GraphQLClient } from 'graphql-request';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
console.log(CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN);

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  throw new Error(
    'CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN must be defined in .env.local'
  );
}

const endpoint = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`;

const client = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
  },
});

export const request = async <T>(query: string, variables?: any): Promise<T> => {
  try {
    return await client.request<T>(query, variables);
  } catch (error) {
    console.error('Error making Contentful API request:', error);
    throw new Error('Could not fetch from Contentful API');
  }
}; 