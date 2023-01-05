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

    return {
        fetchController,
        fetchBuildingControllers
    }
}