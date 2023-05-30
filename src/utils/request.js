import axios from 'axios'

axios.defaults.withCredentials = true

const request = axios.create({
    baseURL: '//localhost:2345',
    timeout: 5000,
    headers:{
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
    }
});

export default request