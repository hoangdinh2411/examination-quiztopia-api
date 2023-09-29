const Tables = {
  QuizTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: 'Quiz_Table',
      AttributeDefinitions: [
        {
          AttributeName: 'PK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'SK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'GSI_1_PK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'GSI_1_SK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'LEADER_BOARD_PK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'LEADER_BOARD_SK',
          AttributeType: 'N',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'PK',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'SK',
          KeyType: 'RANGE',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'GSI_1',
          KeySchema: [
            {
              AttributeName: 'GSI_1_PK',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'GSI_1_SK',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'LEADER_BOARD_INDEX',
          KeySchema: [
            {
              AttributeName: 'LEADER_BOARD_PK',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'LEADER_BOARD_SK',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'INCLUDE',
            NonKeyAttributes: ['Score', 'Username'],
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
    },
  },
};

export default Tables;
