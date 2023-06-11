import { axe } from "./api";
import { reactive, toRefs } from "vue";
import { useAccount } from "./account";

const state = reactive({
    nodes: []
})

export const useNode = () => {

    const fetchControllerNodes = (id) => {
        return axe.post('', {
            query: `{
                node(where: {controller_id: {_eq: "${id}"}}) {
                    account_id
                    controller_id
                    created_at
                    description
                    id
                    ip_local
                    model
                    settings
                    status
                }
              }`
        })
    }

    const pushToNodes = (value) => {
        state.nodes.push(value)
    }

    const fetchNodes = async (controllers) => {
        // let gotAll = false
        // for (let index = 0; index < controllers.length; index++) {
        //     try {
        //         const nodes = await fetchControllerNodes(controllers[index].id)
        //         if (nodes.data.data.node.length){
        //             pushToNodes(...nodes.data.data.node)
        //         }
        //         if(index === controllers.length - 1){
        //             gotAll = true
        //         }
        //     } catch (error) {
        //         gotAll = false
        //         console.log('failed to fetch nodes')
        //     }
        // }
        // if (gotAll){
        //     console.log('result:')
        //     console.log(state.nodes)
        //     return Promise.resolve(state.nodes)
        // }
        // return Promise.reject(null)
        let controllerArray = [...controllers]
        let nodeArray = []
        for (let index = 0; index < controllers.length; index++) {
            nodeArray.push(fetchControllerNodes(controllers[index].id))
        }
        return Promise.all(nodeArray)
    }

    const fetchNode = (id) => {
        return axe.post('', {
            query: `{
                node(where: {id: {_eq: "${id}"}}) {
                    account_id
                    controller_id
                    created_at
                    description
                    id
                    ip_local
                    model
                    settings
                    status
                    lat
                    long
                }
              }`
        })
    }

    const fetchNodeChannels = (id) => {
        return axe.post('', {
            query: `{
                channel(where: {node_id: {_eq: "${id}"}}) {
                    id
                    value
                    type
                    number
                }
              }`
        })
    }

    const emptyNodes = () => {
        state.nodes = []
    }

    const createNode = async (params) => {
        const { userId } = useAccount()
        return axe.post(
            '', {
            query: `mutation InsertNode {
                insert_node(objects: {controller_id: "${params.controller_id}",id: "${params.id}",status: "${params.status}", description: "${params.description}", account_id: "${userId.value}", model: "${params.model}", ip_local: "${params.ip_local}"}) {
                  affected_rows
                  returning {
                    id
                  }
                }
              }`
        })
    }

    const updateNodeStatus = async (id, status) => {
        return axe.post(
            '', {
            query: `mutation NodeStatus {
                update_node(where: {id: {_eq: "${id}"}}, _set: {status: "${status}"}) {
                  affected_rows
                  returning {
                    status
                    id
                  }
                }
              }`
        })
    }

    return {
        pushToNodes,
        fetchControllerNodes,
        fetchNodes,
        fetchNode,
        emptyNodes,
        fetchNodeChannels,
        createNode,
        updateNodeStatus,
        ...toRefs(state)
    }
}