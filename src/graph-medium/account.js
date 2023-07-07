import { reactive, toRefs } from "vue";
import { axe } from "./api";
import SecureLS from "secure-ls";
import router from "../router";

const state = reactive({
  username: '',
  userId: '',
  role: ''
})

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

// insert_account(objects: {name: "${options.options.name}", username: "${options.username}", age: "${options.age}", password: "${options.password}", password: "${options.password}""}, on_conflict: {constraint: building_pkey, update_columns: account_id}) {
export const useAccount = () => {

  const createAccount = async (options) => {
    return axe.post(
      '', {
      query: `mutation CreateAccount {
                insert_account(objects: {username: "${options.username}", name: "${options.name}" id: "${'test-id'}", password: "${options.password}", age: "${options.age}", email: "${options.email}", mobile_number: "${options.mobile_number}", role: "${options.role ? options.role : 'boss'}"}) {
                  affected_rows
                  returning {
                    id
                  }
                }
              }`
    })
  }

  const attemptLogin = async (options) => {
    try {
      const userResponse = await axe.post(
        '', {
        query: `{
                    account(where: {username: {_eq: "${options.username}"}}) {
                      username
                      password
                      id
                      role
                    }
                  }`
      })
      if (userResponse?.data?.data?.account[0]) {
        let user = userResponse.data.data.account[0]
        if (user.password == options.password) {
          cookieStorage.setItem('_account', user.username)
          cookieStorage.setItem('_account_id', user.id)
          //boss-admin or client
          cookieStorage.setItem('_account_role', user.role)
          setUsername(user.username)
          setUserId(user.id)
          router.push('/')
          return Promise.resolve('ورود موفقیت آمیز بود')
        }
        else {
          return Promise.reject('گذرواژه معتبر نیست')
        }
      }
      else
        return Promise.reject('کاربر یافت نشد')
    } catch (error) {
      return Promise.reject('خطا در ورود به اکانت')
    }
  }

  const setUsername = (val) => {
    state.username = val
  }

  const setUserId = (val) => {
    state.userId = val
  }

  const setUserRole = (val) => {
    state.role = val
  }

  const logout = () => {
    cookieStorage.setItem('_account', '')
    cookieStorage.setItem('_account_id', '')
    setUsername('')
    setUserId('')
    router.push({ name: 'LoginForm' })
  }

  const getAllAccounts = () => {
    return axe.post('', {
      query: `query GetAccounts {
        account {
          id
          name
        }
      }`
    })
  }

  const getBuildingAccounts = () => {
    return axe.post('', {
      query: `query MyQuery {
        building_account {
          account_id
          building_id
        }
      }`
    })
  }

  const deleteRelation = (params) => {
    return axe.post('', {
      query: `mutation MyDeleteMutation {
        delete_building_account(where: {_and: {account_id: {_eq: "${params.account}"}, building_id: {_eq: "${params.building}"}}}) {
          returning{
            account_id
          }
        }
      }`
    })
  }

  const addRelation = (params) => {
    return axe.post('', {
      query: `mutation MyAddRelation {
        insert_building_account(objects:{account_id:"${params.account}",building_id:"${params.account}"}){
          affected_rows
          returning{
            account_id
            building_id
          }
        }
      }`
    })
  }

  const updateBuildingAccount = (params) => {
    return axe.post('', {
    query: `mutation MyMutation {
      update_building(where: {id: {_eq: "${params.building_id}"}}, _set: {account_id: "${params.account_id}"}) {
        affected_rows
      }
    }`
  })
}
  

  return {
    createAccount,
    setUsername,
    attemptLogin,
    setUserId,
    getAllAccounts,
    getBuildingAccounts,
    deleteRelation,
    addRelation,
    setUserRole,
    logout,
    setUserRole,
    updateBuildingAccount,
    ...toRefs(state)
  }
}