import axios from "axios"
export const axe = axios.create({
    headers:{
        'x-hasura-access-key' : 'hasurasecret'
    },
    baseURL: 'http://localhost:8080/v1/graphql'
    // baseURL: 'http://185.231.181.50:8080/v1/graphql'
})