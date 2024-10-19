
import { axiosSecure } from "@/http/connection/axiosHTTP"
//import { emptyObject, assignObjectExists, assignObjectStrict } from '@/util/objectDyl'
import { strictlyAssignProperties, isEmptyObject } from "@/utils/objectHelpers"
class API {
    constructor() {
        this._fields = {
            id: 0
        }
        this._parameters = {}
        this._payload = { ...this._fields }
        this._payload_operation = "no_operation"
        this._config = {
            headers: {
                'Assept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        this._endpoints = {
            list: { url: "", method: "" },
            create: { url: "", method: "" },
            update: { url: "", method: "" },
            delete: { url: "", method: "" },
        }
    }

    async list() {
        try {
            const endpoint_list = this._endpoints.list

            const resolve = await axiosSecure[endpoint_list.method](endpoint_list.url, {
                ...this._parameters,
            }, this._config)
            return resolve.data

        } catch (error) {
            if (error.response == undefined || error.response.data == undefined) {
                return { api_status: false, detail: error + "" }
            }
            return error.response.data
        }
    }

    async create() {
        try {
            const endpoint_create = this._endpoints.create
            const resolve = await axiosSecure[endpoint_create.method](endpoint_create.url, {
                payload: { ...this._payload },
                ...this._parameters
            }, this.config)
            return resolve.data
        } catch (error) {
            if (error.response == undefined || error.response.data == undefined) {
                return { api_status: false, detail: error + "" }
            }
            return error.response.data
        }
    }

    async update() {
        try {

            const endpoint_update = this._endpoints.update
            const url = this.replaceUrlParam(endpoint_update.url)
            const resolve = await axiosSecure[endpoint_update.method](url, {
                payload: { ...this._payload },
                ...this._parameters
            }, this.config)
            return resolve.data
        } catch (error) {
            if (error.response == undefined || error.response.data == undefined) {
                return { api_status: false, detail: error + "" }
            }
            return error.response.data
        }
    }
    async delete() {
        try {
            const endpoint_delete = this._endpoints.delete
            const url = this.replaceUrlParam(endpoint_delete.url)
            const resolve = await axiosSecure[endpoint_delete.method](url, {
                ...this._parameters
            }, this.config)
            return resolve.data
        } catch (error) {
            if (error.response == undefined || error.response.data == undefined) {
                return { api_status: false, detail: error + "" }
            }
            return error.response.data
        }
    }

    loadPayload(source, payload_operation) {
        let key
        let object_attributes = {};
        let non_object_attributes = {};
        if (source != undefined && source != null && !isEmptyObject(source)) {
            for (key in this._payload) {
                if (typeof this._payload[key] === 'object') {
                    // Si el atributo es un objeto, lo almacenamos en object_attributes (objeto anidado)
                    object_attributes[key] = this._payload[key]

                } else {
                    non_object_attributes[key] = this._payload[key]
                }
            }

            // procesar objetos anidados
            if (!isEmptyObject(object_attributes)) {
                for (key in object_attributes) {
                    object_attributes[key] = strictlyAssignProperties(object_attributes[key], source[key])
                }
            }
            // objetos planos
            if (!isEmptyObject(non_object_attributes)) {
                non_object_attributes = strictlyAssignProperties(non_object_attributes, source)
            }
            this._payload = { ...non_object_attributes, ...object_attributes }
        }
        if(payload_operation!== undefined){
            this._payload_operation = payload_operation
        }
    }

    collectPayload() {
        const payload = this._payload;
        const payload_operation = this._payload_operation
        return { payload, payload_operation }
    }

    loadData() {
        return this.list()
    }

    async sendData() {
        switch (this._payload_operation) {
            case "list":
                return this.list()
            case "create":
                return this.create()
            case "update":
                return this.update()
            case "delete":
                return this.delete()
            default:
                console.error("Operacion no valida.")
        }
    }

    replaceUrlParam(url) {
        return url.replace(/<([\w.]+)>/g, (_, key) => {
            const keys = key.split(".") // Para atributros simples o anidados
            let values = this._payload

            // navega por los campos  usando las claves 
            for (let k of keys) {
                if (values[k] !== undefined && values[k] !== "" && values[k] !== null) {
                    values = values[k] // Si el valor existe, navega hasta el valor final     
                } else {
                    return "no_value_param"
                }

            }
            // retornamos valor den parametro de la url
            return values
        })
    }

    loadParameters(parameters) {
        this._parameters = Object.assign(this._parameters, parameters);
    }

    set endpoints(endpoints) {
        this._endpoints = { ...endpoints }
    }
    get endpoints() {
        return this._endpoints
    }
    set fields(fields) {
        this._fields = { ...fields }
        this._payload = { ...fields }
    }
    get fields() {
        return this._fields
    }

    set config(config) {
        this._config = config
    }

    get config() {
        return this._config
    }

}//aPI

export default API


