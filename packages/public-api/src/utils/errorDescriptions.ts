export const httpResponsesDescriptions = {
  200: 'Successful response',
  400: 'Bad request: a parameter has a value the endpoint does not accept, or the endpoint does not take it. `path` names the parameter.',
  404: 'Not found',
  429: 'Too many requests. The CDN in front of the API sends this answer, so its body may not be JSON.',
  500: 'Internal server error. Quote `errorId` when you report it.',
} as const
