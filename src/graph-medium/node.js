import { axe } from "./api";
import { reactive, toRefs } from "vue";

const state = reactive({
    nodes:[]
})

export const useNode = (building_id) => {

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
        for (let index = 0; index < controllers.length; index++) {
            try {
                const nodes = await fetchControllerNodes(controllers[index].id)
                if(nodes.data.data.node.length)
                    pushToNodes(...nodes.data.data.node)
            } catch (error) {
                console.log('failed to fetch nodes')
            }
        }
    }

    return {
        pushToNodes,
        fetchControllerNodes,
        fetchNodes,
        ...toRefs(state)
    }
}