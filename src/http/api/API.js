
import { axiosSecure } from "@/http/connection/axiosHTTP"
import { strictlyAssignProperties, isEmptyObject } from "@/utils/objectHelpers"
class API {
    constructor() {
        this._fields = {}
        this._parameters = {}
        this._payload = { ...this._fields }
        this._config = {
            "headers": {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        this._endpoints = {
            list: { url: "", method: "" },
            create: { url: "", method: "" },
            update: { url: "", method: "" },
            delete: { url: "", method: "" },
            read: { url: "", method: "" },
        }
    }

    async list() {
        try {
            const endpoint_list = this._endpoints.list
            const url = this.replaceUrlParam(endpoint_list.url)
            const resolve = await axiosSecure[endpoint_list.method](url, this._config)
            return resolve.data

        } catch (error) {
            if (error.response === undefined || error.response.data === undefined) {
                return { api_status: false, detail: error + "" }
            }
            return error.response.data
        }
    }

    async read() {
        try {
            const endpoint_read = this._endpoints.read
            const url = this.replaceUrlParam(endpoint_read.url)
            const resolve = await axiosSecure[endpoint_read.method](url, {
                ...this._parameters,
            }, this._config)
            return resolve.data

        } catch (error) {
            if (error.response === undefined || error.response.data === undefined) {
                return { api_status: false, detail: error + "" }
            }
            return error.response.data
        }
    }

    async create() {
        try {
            const endpoint_create = this._endpoints.create

            const resolve = await axiosSecure[endpoint_create.method](endpoint_create.url, {
                ...this._payload,
                ...this._parameters
            }, this._config)
            return resolve.data
        } catch (error) {
            if (error.response === undefined || error.response.data === undefined) {
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
                ...this._payload,
                ...this._parameters
            }, this._config)
            return resolve.data
        } catch (error) {
            if (error.response === undefined || error.response.data === undefined) {
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
            }, this._config)
            return resolve.data
        } catch (error) {
            if (error.response === undefined || error.response.data === undefined) {
                return { api_status: false, detail: error + "" }
            }
            return error.response.data
        }
    }

    loadPayload(source) {
        let key
        let object_attributes = {};
        let non_object_attributes = {};

        for (key in this._payload) {
            //forma mas segura de consultar si es un objeto
            if (Object.prototype.toString.call(this._payload[key]) === '[object Object]') {
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
            // retornamos  parametro de la url

            return values
        })
    }

    collectPayload() {
        return this._payload;
    }

    loadParameters(parameters) {
        this._parameters = Object.assign(this._parameters, parameters);
    }

    set endpoints(endpoints) {
        this._endpoints = endpoints
    }
    get endpoints() {
        return this._endpoints
    }
    set fields(fields) {
        this._fields = fields
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


