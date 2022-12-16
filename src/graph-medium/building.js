import { computed, onMounted, reactive, toRefs, watch } from "vue";
import { gql } from "graphql-tag"
import { useQuery, useResult } from "@vue/apollo-composable"
import axios from "axios";
import { useController } from "./controller";

const { fetchBuildingControllers } = useController()
const axe = axios.create({
    headers:{
        'x-hasura-access-key' : 'hasurasecret'
    }
})
const state = reactive({
    buildingsTree: [],
    buildings: []
})

export const useBuilding = () => {

    const getAllBuildings = async () => {
            try {
              const res = await axe.post(
                'http://185.231.181.50:8080/v1/graphql', {
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
            } catch (e) {
              console.log('err', e)
            }
    }

    const createBuilding = async ( id, name, address, lat, long) => {
      return axe.post(
        'http://185.231.181.50:8080/v1/graphql', {
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
        'http://185.231.181.50:8080/v1/graphql', {
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
          'http://185.231.181.50:8080/v1/graphql', {
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