import { computed, reactive, toRefs } from "vue";
import { axe } from "./api";
import { useController } from "./controller";
import SecureLS from "secure-ls";
import { useNode } from "./node";
import { useAccount } from "./account";

const { username,userId } = useAccount()

var ls = new SecureLS({
  encodingType: "aes",
  isCompression: false,
  encryptionSecret: "123456789",
});

const cookieStorage = {
  getItem: (key) => ls.get(key),
  setItem: (key, value) =>
    ls.set(key, value),
  removeItem: (key) => ls.remove(key),
};

const { fetchBuildingControllers } = useController()
const { fetchNodes, emptyNodes, fetchControllerNodes } = useNode()

const state = reactive({
    buildingsTree: [],
    buildings: [],
})

const getAdminQuery = () => {
  return `{
    building{
      address
      name
      type
      lat
      long
      status
      created_at
      id
    }
  }`
}

const getUserQuery = (id) => {
  return `{
    building(where: {account_id: {_eq: "${id}"}}){
      address
      name
      type
      lat
      long
      status
      created_at
      id
    }
  }`
}

export const useBuilding = () => {

    state.buildingsTree = cookieStorage.getItem('_buildings')

    const getAllBuildings = async (options) => {
            let query = getUserQuery(userId.value)
            if(options?.admin){
              query = getAdminQuery()
            }
            try {
              const res = await axe.post(
                '', {
                    query
              })
              let list = res.data.data.building
              emptyNodes()
              for (let index = 0; index < list.length; index++) {
                const element = list[index];
                element.label = element.name
                try {
                    const controllers = await fetchBuildingControllers(element.id)
                    element.controllers = controllers.data.data.controller
                    if(element.controllers.length){
                      for (let index = 0; index < element.controllers.length; index++) {
                        const controller = element.controllers[index];
                        let nodesResp = await fetchControllerNodes(controller.id)
                        element.controllers[index].nodes = nodesResp.data.data.node
                      }
                      // fetchNodes(element.controllers).then((res)=>{
                      //   let nodes = []
                      //   for (let i = 0; i < res.length; i++) {
                      //     const element = res[i];
                      //     nodes = [...nodes, ...element.data.data.node]
                      //   }
                      //   console.log('nodes',nodes)
                      //   if(nodes.length){
                      //     for (let index = 0; index < nodes.length; index++) {
                      //       const node = nodes[index];
                      //       let nodeController = element.controllers.findIndex((c)=>{
                      //         return c.id == node.controller_id
                      //       })
                      //       if(element.controllers[nodeController] && element.controllers[nodeController].nodes){
                      //         if(Array.isArray( element.controllers.nodes ))
                      //           element.controllers.nodes.push(node)
                      //         else
                      //           element.controllers.nodes = [node]
                      //       }
                      //       else if(element.controllers[nodeController]){
                      //         element.controllers[nodeController].nodes = [node]
                      //       }
                      //     }
                      //   }
                      // })
                    }
                } catch (error) {
                    console.log('err', error)      
                }
              }
              state.buildingsTree = [...list]
              cookieStorage.setItem('_buildings',state.buildingsTree)
              
            } catch (e) {
              console.log('err', e)
            }
    }

    const createBuilding = async ( name, address, lat, long) => {
      return axe.post(
        '', {
            query: `mutation MyMutation {
              insert_building(objects: {name: "${name}", account_id: "${userId.value}", address: "${address}", lat: "${lat}", long: "${long}"}, on_conflict: {constraint: building_pkey, update_columns: account_id}) {
                affected_rows
                returning {
                  address
                  name
                  type
                  lat
                  long
                  status
                  created_at
                  id
                }
              }
            }`
      })
    }

    const updateBuilding = async ( id, name, address, lat, long) => {
      return axe.post(
        '', {
            query: `mutation MyMutation {
              update_building(where: {id: {_eq: "${id}"}}, _set: {name: "${name}", id: "${id}", address: "${address}", lat: "${lat}", long: "${long}"}) {
                affected_rows
                returning {
                  address
                  name
                  type
                  lat
                  long
                  status
                  created_at
                  id
                }
              }
            }`
      })
    }

    const fetchBuilding = (id) => {
      return axe.post(
          '', {
            query: `{
              building(where: {id: {_eq: "${id}"}}) {
                address
                name
                type
                lat
                long
                status
                created_at
                id
              }
            }`
        })
    }

    const fetchBuildingAccounts = (id) => {
      return axe.post(
          '', {
            query: `{
              building {
                account_id
                name
                id
              }
            }`
        })
    }

    const getBuildingFromLs = (id) => {
      let tree = state.buildingsTree
      let result = null
      if(tree.length){
        let building = tree.filter((b)=>{
          return b.id == id
        })
        result = building.length ? building[0] : null
      }
      return result
    }

    const getAllControllers = computed(()=>{
      let controllers = []
      state.buildingsTree.forEach((b)=>{
        if(b.controllers?.length){
          b.controllers.forEach((c)=>{
            controllers.push(c)
          })
        }
      })
      return controllers
    })


    return {
        ...toRefs(state),
        getAllBuildings,
        createBuilding, 
        fetchBuilding,
        getBuildingFromLs,
        updateBuilding,
        fetchBuildingAccounts,
        getAllControllers
    }
}