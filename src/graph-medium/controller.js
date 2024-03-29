import { axe } from "./api";


export const useController = (building_id) => {

    const fetchBuildingControllers = (id) => {
        return axe.post('', {
            query: `{
                controller(where: {building_id: {_eq: "${id}"}}) {
                  mac_address
                  model
                  id
                }
              }`
      })
    }

    const fetchController = (id) => {
        return axe.post('', {
            query: `{
                controller(where: {id: {_eq: "${id}"}}) {
                  mac_address
                  model
                  id
                }
              }`
      })
    }

    const fetchControllerNodes = (id) => {
      return axe.post('', {
        query: `{
            node(where: {controller_id: {_eq: "${id}"}}) {
              controller_id
              id
            }
          }`
        })
    }

    const fetchLogsInterval = (to,from,node_id) => {
      return axe.post('', {
            query: `{
                log(where: {created_at: {_gte: "${from}", _lte: "${to}"}, node_id: {_eq: "${node_id}"}}) {
                  log
                  created_at
                }
              }`
      })
    }

    const createController = async ( params ) => {
      return axe.post(
        '', {
            query: `mutation InsertController {
              insert_controller(objects: {ip_local: "${params.ip_local}", id: "test-${params.model}", status: "test-${params.status}", model: "${params.model}", mac_address: "${params.mac_address}", building_id: "${params.building_id}"}) {
                affected_rows
                returning {
                  id
                }
              }
            }`
      })
    }

    return {
        fetchController,
        fetchBuildingControllers,
        fetchControllerNodes,
        fetchLogsInterval,
        createController
    }
}