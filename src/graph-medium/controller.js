import { computed, onMounted, reactive, toRefs, watch } from "vue";
import { gql } from "graphql-tag"
import { useQuery } from "@vue/apollo-composable"
import axios from "axios";

const axe = axios.create({
    headers:{
        'x-hasura-access-key' : 'hasurasecret'
    }
})

const state = reactive({
    controllerTree: null,
    buildingcontroller: {}
})

export const useController = (building_id) => {
    // onMounted(()=>{
    //     const fetchBuildingController = (id) => {
    //         return useQuery(gql`{
    //             controller(where: {building_id: {_eq: "${id}"}}) {
    //               mac_address
    //             }
    //           }`)
    //     }
    //     if(building_id)
    //     state.controllerTree = fetchBuildingController(building_id)
    // })

    // const controller = computed(()=>{
    //     return state.controllerTree?.result?.controller ? state.controllerTree?.result?.controller : ''
    // })

    // watch(controller.value,(v)=>{
    //     state.buildingControllers = v
    // })

    const fetchBuildingControllers = (id) => {
        return axe.post('http://185.231.181.50:8080/v1/graphql', {
            query: `{
                controller(where: {building_id: {_eq: "${id}"}}) {
                  mac_address
                }
              }`
      })
    }

    return {
        ...toRefs(state),
        fetchBuildingControllers
    }
}