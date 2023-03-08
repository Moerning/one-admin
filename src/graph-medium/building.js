import { reactive, toRefs } from "vue";
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
const { fetchNodes, emptyNodes } = useNode()

const state = reactive({
    buildingsTree: [],
    buildings: [],
})

export const useBuilding = () => {

    state.buildingsTree = cookieStorage.getItem('_buildings')

    const getAllBuildings = async () => {
            try {
              const res = await axe.post(
                '', {
                    query: `{
                        building(where: {account_id: {_eq: "${userId.value}"}}){
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
              let list = res.data.data.building
              emptyNodes()
              for (let index = 0; index < list.length; index++) {
                const element = list[index];
                try {
                    const controllers = await fetchBuildingControllers(element.id)
                    element.controllers = controllers.data.data.controller
                    if(element.controllers.length){
                      let nodes = await fetchNodes(element.controllers)
                      if(nodes.length){
                        for (let index = 0; index < nodes.length; index++) {
                          const node = nodes[index];
                          let nodeController = element.controllers.findIndex((c)=>{
                            return c.id == node.controller_id
                          })
                          if(element.controllers[nodeController] && element.controllers[nodeController].nodes){
                            element.controllers.nodes.push(node)
                          }
                          else if(element.controllers[nodeController]){
                            element.controllers[nodeController].nodes = [node]
                          }
                        }
                      }
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

    const createBuilding = async ( id, name, address, lat, long) => {
      return axe.post(
        '', {
            query: `mutation MyMutation {
              insert_building(objects: {name: "${name}", id: "${id}", account_id: "${userId.value}", address: "${address}", lat: "${lat}", long: "${long}"}, on_conflict: {constraint: building_pkey, update_columns: account_id}) {
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


    return {
        ...toRefs(state),
        getAllBuildings,
        createBuilding, 
        fetchBuilding,
        getBuildingFromLs,
        updateBuilding
    }
}