export default {
  type: 'object',
  properties: {
    score: { type: 'number' },
    quizId: { type: 'string' },
  },
  required: ['score', 'quizId'],
} as const;
