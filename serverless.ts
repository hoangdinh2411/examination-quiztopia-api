import type { AWS } from '@serverless/typescript';

import {
  signup,
  signin,
  createQuiz,
  deleteQuiz,
  getAllQuiz,
  getOwnQuiz,
  addQuestionForQuiz,
  getQuestionsOfQuiz,
  addRecordForQuiz,
  getLeaderBoard,
} from '@functions/index';
import Tables from 'src/yaml/dynamoDB';

const serverlessConfiguration: AWS = {
  service: 'quiztopia-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    region: 'eu-north-1',
    profile: '${env:PROFILE}',
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: '${env:ROLE}',
    },
    environment: {
      REGION: '${self:provider.region}',
      TABLE: 'Quiz_Table',
      JWT_SECRET: '${env:JWT_SECRET}',
    },
  },
  useDotenv: true,
  // import the function via paths
  functions: {
    signup,
    signin,
    createQuiz,
    deleteQuiz,
    getAllQuiz,
    getOwnQuiz,
    addQuestionForQuiz,
    getQuestionsOfQuiz,
    addRecordForQuiz,
    getLeaderBoard,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: [],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    serverName: '$self:service',
    exportName: '$self:service' + '-export',
  },
  resources: {
    Resources: Tables,
  },
};

module.exports = serverlessConfiguration;
