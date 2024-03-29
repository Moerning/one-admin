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

    const createEvent = async ( node,unit_id,priority ) => {
        return axe.post(
          '', {
              query: `mutation InsertEvent {
                insert_event(objects: {node_id: "${node}", priority: "${priority}", unit_id: "${unit_id}"}) {
                  affected_rows
                  returning {
                    id
                  }
                }
              }`
        })
      }

    return {
        fetchBuildingEvents,
        createEvent
    }
}