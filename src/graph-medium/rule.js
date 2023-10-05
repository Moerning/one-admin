import { axe } from "./api";
import { reactive, toRefs } from "vue";
import { useAccount } from "./account";
const { username,userId } = useAccount()

const state = reactive({
  rules: []
})

export const useRule = () => {

  const getAllRules = async () => {
    try {
      const { data } = await axe.post('', {
        query: `query RuleIndex {
                  rule(where: {account_id: {_eq: "${userId.value}"}}) {
                    desired_source_channel_value
                    desired_target_channel_value
                    id
                    source_channel_id
                    status
                    target_channel_id
                    condition
                  }
                }`
      })
      
      state.rules = [...data.data.rule]
      
    } catch (error) {
      
    }
  }
  const fetchRule = (id) => {
    return axe.post('', {
      query: `query RuleQuery {
                rule(where: {id: {_eq: "${id}"}}) {
                  desired_source_channel_value
                  desired_target_channel_value
                  id
                  source_channel_id
                  status
                  target_channel_id
                  condition
                }
              }`
    })
  }

  const createRule = async (params) => {
    const { userId } = useAccount()
    return axe.post(
      '', {
      query: `mutation InsertRule {
                insert_rule(objects: {id: "${params.id}",condition: "${params.condition}",account_id: "${userId.value}",desired_source_channel_value: "${params.source_channel_value}",desired_target_channel_value: "${params.target_channel_value}", source_channel_id: "${params.source_channel}", target_channel_id: "${params.target_channel}", status: "${params.status}"}) {
                  affected_rows
                  returning {
                    id
                  }
                }
              }`
    })
  }

  const updateRule = async (id, params) => {
    return axe.post(
      '', {
      query: `mutation RuleMutation {
              update_rule(where: {id: {_eq: "${id}"}}, _set: {condition: "${params.condition}",desired_source_channel_value: "${params.source_channel_value}",desired_target_channel_value: "${params.target_channel_value}", source_channel_id: "${params.source_channel}", target_channel_id: "${params.target_channel}", status: "${params.status}"}) {
                affected_rows
                returning {
                  desired_source_channel_value
                  desired_target_channel_value
                  id
                  source_channel_id
                  status
                  target_channel_id
                  condition
                }
              }
            }`
    })
  }

  const deleteRule = async (id) => {
    return axe.post(
      '', {
      query: `mutation RuleDeleteMutation {
        delete_rule(where: {id: {_eq: "${id}"}}) {
          affected_rows
        }
      }`
    })
  }


  return {
    createRule,
    getAllRules,
    fetchRule,
    updateRule,
    deleteRule,
    ...toRefs(state)
  }
}