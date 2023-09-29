import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const db = new DocumentClient({
  region: process.env.REGION,
});

export default db;
