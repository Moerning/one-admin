import { reactive, toRefs } from "vue";
import { gql } from "graphql-tag";
import { useQuery, useResult } from "@vue/apollo-composable";
import { axe } from "./api";
import { useController } from "./controller";
import SecureLS from "secure-ls";

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

const state = reactive({
    buildingsTree: [],
    buildings: []
})

export const useBuilding = () => {

    state.buildingsTree = cookieStorage.getItem('_buildings')

    const getAllBuildings = async () => {
            try {
              const res = await axe.post(
                '', {
                    query: `{
                        building {
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
              for (let index = 0; index < list.length; index++) {
                const element = list[index];
                try {
                    const controllers = await fetchBuildingControllers(element.id)
                    element.controllers = controllers.data.data.controller
                } catch (error) {
                    console.log('err', e)      
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
              insert_building(objects: {name: "${name}", id: "${id}", address: "${address}", lat: "${lat}", long: "${long}"}, on_conflict: {constraint: building_pkey, update_columns: account_id}) {
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

    getAllBuildings()

    return {
        ...toRefs(state),
        getAllBuildings,
        createBuilding, 
        fetchBuilding,
        updateBuilding
    }
}