module.exports = {
    client: {
      service: {
        name: 'my-app',
        // URL to the GraphQL API
        url: '188.121.122.21/graphql',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }