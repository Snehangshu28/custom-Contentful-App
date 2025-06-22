import { GraphQLClient } from 'graphql-request';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

const endpoint = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`;

const client = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
  },
});

export const request = async <T>(query: string, variables?: any): Promise<T> => {
  try {
    console.log('🔍 Testing query:', query);
    
    // First test with schema query
    const schemaQuery = `
      query {
        __schema {
          types {
            name
          }
        }
      }
    `;
    
    const schemaResult = await client.request(schemaQuery);
    const contentTypes = schemaResult.__schema.types.filter((t: any) => 
      t.name.includes('Collection')
    );
    console.log('📋 Available content types:', contentTypes.map((t: any) => t.name));
    
    const result = await client.request<T>(query, variables);
    console.log('✅ Query successful:', result);
    return result;
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};