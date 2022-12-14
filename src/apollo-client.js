import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core"
import { getMainDefinition } from "@apollo/client/utilities"
import { onError } from "@apollo/client/link/error"
import { logErrorMessages } from "@vue/apollo-util"

function getHeaders() {
    const headers = {}
    headers["x-hasura-access-key"] = `hasurasecret`
    return headers
}

// Create an http link:
const httpLink = new HttpLink({
    uri: "http://185.231.181.50:8080/v1/graphql",
    fetch: (uri, options) => {
        options.headers = getHeaders()
        return fetch(uri, options)
    },
})

const errorLink = onError((error) => {
    if (process.env.NODE_ENV !== "production") {
        logErrorMessages(error)
    }
})

// Create the apollo client
export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(httpLink),
})