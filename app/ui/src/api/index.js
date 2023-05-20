import auth from "../auth"

class API {
    constructor(){
    }
   
    async call(endpoint, body){
        const res = await fetch('/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                endpoint
            },
            body: JSON.stringify(body||{}),
        })

        return res.json().then((r)=>{
            return {
                status: res.status,
                body: r,
                error: r.error
            }
        })
    }
}


export default API