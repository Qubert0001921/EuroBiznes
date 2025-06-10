import cfg from "./config"
export default {
    get: async function (route){
        const url = cfg.backendURL + route
        const data = await fetch(url, {
            headers: {
                'Access-Control-Allow-Origin': "False"
            }
        })
        return data
        
    }
}