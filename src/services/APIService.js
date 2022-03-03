import axios from 'axios';

class APIService{

    constructor(){

    }

    async getContactList(){
        const response = await axios.get('https://my-json-server.typicode.com/voramahavir/contacts-mock-response/contacts')
        return response.data;
    }


}

export default APIService;

