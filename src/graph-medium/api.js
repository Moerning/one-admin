import axios from "axios"
export const axe = axios.create({
    headers:{
        'x-hasura-access-key' : 'hasurasecret'
    },
    baseURL: 'http://188.121.122.21:8080/v1/graphql'
    // baseURL: 'http://188.121.122.21:8080/'
})