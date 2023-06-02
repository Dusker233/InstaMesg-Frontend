import {defineStore} from 'pinia'

export const websocket = defineStore("websocket", {
    state: () => {
        return ({
            msg: ''
        })
    }
})