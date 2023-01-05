import { axe } from "./api";


export const useLog = (building_id) => {

    const fetchLog = (to,from) => {
        return axe.post('', {
            query: `{
                log(where: {created_at: {_gte: "${from}", _lte: "${to}"}}) {
                  log
                  created_at
                }
              }`
      })
    }

    return {
        fetchLog
    }
}