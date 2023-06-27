import axios from 'axios';
import Cookies from 'js-cookie';

class API {
    constructor(){
        this.instance = axios.create();

        this.instance.interceptors.request.use((config) => {
            const savedHeader = Cookies.get('save');
            if (savedHeader) {
              const parsedHeader = JSON.parse(savedHeader);
              config.headers['username'] = parsedHeader.username;
            }
            return config;
          }, (error) => {
            return Promise.reject(error);
          });
    }
   
    async call(endpoint, body){
        return this.instance.post('/api', body, { headers: { endpoint } })
    }
}


export default API