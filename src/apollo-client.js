import { ApolloClient, split, InMemoryCache, HttpLink } from "@apollo/client/core"
import { WebSocketLink } from "@apollo/client/link/ws"
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
    uri: "188.121.122.21/v1/graphql",
    fetch: (uri, options) => {
        options.headers = getHeaders()
        return fetch(uri, options)
    },
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: "ws://188.121.122.21/v1/graphql",
    options: {
        reconnect: true,
        lazy: true,
        timeout: 30000,
        inactivityTimeout: 30000,
        connectionParams: () => {
            return { headers: getHeaders() }
        },
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
    link: errorLink.concat(
        split(
            // split based on operation type
            ({ query }) => {
                const definition = getMainDefinition(query)
                return (
                    definition.kind === "OperationDefinition" &&
                    definition.operation === "subscription"
                )
            },
            wsLink,
            httpLink
        )
    ),
})