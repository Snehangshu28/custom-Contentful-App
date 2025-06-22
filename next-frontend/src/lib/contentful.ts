import { GraphQLClient } from 'graphql-request';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

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

export const request = async <T>(query: string, variables?: Record<string, unknown>): Promise<T> => {
  try {
    const result = await client.request<T>(query, variables);
    return result;
  } catch (error: unknown) {
    console.error('❌ Contentful API Error:', error instanceof Error ? error.message : 'Unknown error');
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Error details:', (error as { response?: { errors?: unknown } }).response?.errors || error);
    }
    throw new Error('Could not fetch from Contentful API');
  }
};