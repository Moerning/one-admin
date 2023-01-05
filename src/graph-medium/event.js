import { axe } from "./api"

export const useEvent = (building_id) => {

    const fetchBuildingEvents = (id) => {
        return axe.post('', {
            query: `{
                event(where: {node_id: {_eq: "${id}"}}) {
                    account_id
                    created_at
                    deleted_at
                    id
                    log_id
                    node_id
                    priority
                    status
                    unit_id
                }
              }`
        })
    }

    return {
        fetchBuildingEvents
    }
}