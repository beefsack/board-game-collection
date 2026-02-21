import { defineConfig } from 'orval'

export default defineConfig({
  boardGameCollection: {
    input: {
      target: './openapi.json',
    },
    output: {
      client: 'react-query',
      httpClient: 'fetch',
      target: './src/api/generated.ts',
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'apiFetch',
        },
        query: {
          version: 5,
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
})
