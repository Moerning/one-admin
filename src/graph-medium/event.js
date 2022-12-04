import axios from "axios";

const axe = axios.create({
    headers:{
        'x-hasura-access-key' : 'hasurasecret'
    }
})


export const useEvent = (building_id) => {

    const fetchBuildingEvents = (id) => {
        return axe.post('http://185.231.181.50:8080/v1/graphql', {
            query: `{
                event(where: {node_id: {_eq: "${id}"}}) {
                  mac_address
                }
              }`
        })
    }

    return {
        fetchBuildingEvents
    }
}