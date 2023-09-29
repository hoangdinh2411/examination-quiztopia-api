export default {
  type: 'object',
  properties: {
    question: { type: 'string' },
    answer: { type: 'string' },
    location: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' },
      },
    },
    quizId: { type: 'string' },
  },
  required: ['question', 'answer', 'location', 'quizId'],
} as const;
