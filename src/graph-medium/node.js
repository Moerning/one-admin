import { axe } from "./api";
import { reactive, toRefs } from "vue";

const state = reactive({
    nodes:[]
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

    const pushToNodes = (value)=> {
        state.nodes.push(value)
    }

    const fetchNodes = async (controllers) => {
        let gotAll = true
        for (let index = 0; index < controllers.length; index++) {
            try {
                const nodes = await fetchControllerNodes(controllers[index].id)
                if(nodes.data.data.node.length)
                    pushToNodes(...nodes.data.data.node)
            } catch (error) {
                gotAll = false
                console.log('failed to fetch nodes')
            }
        }
        if(gotAll)
            return Promise.resolve(state.nodes)
        return Promise.reject(null)
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
                }
              }`
      })
    }

    const fetchNodeChannels = (id) => {
        return axe.post('', {
            query: `{
                channel(where: {node_id: {_eq: "${id}"}}) {
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

    return {
        pushToNodes,
        fetchControllerNodes,
        fetchNodes,
        fetchNode,
        emptyNodes,
        fetchNodeChannels,
        ...toRefs(state)
    }
}