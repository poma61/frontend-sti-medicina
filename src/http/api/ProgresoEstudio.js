import API from "@/http/api/API";
import { axiosSecure } from "@/http/connection/axiosHTTP";

class ProgresoEstudio extends API {
    constructor(progreso_estudio) {
        super()
        this.fields = {
            id: 0,
            tema: 0,
            tiempo_est: "",
        }

        this.endpoints = {
            list: { url: "user/estudiante/progreso-estudio/", method: "get" },
            create_or_update: { url: "user/estudiante/progreso-estudio/", method: "post" },
        }

        if (progreso_estudio !== undefined) {
            this.loadPayload(progreso_estudio)
        }

    } // constructor

    async createOrUpdate() {
        try {
            const parsed_url = this.replaceUrlParam(this.endpoints.create_or_update.url)
            const method = this.endpoints.create_or_update.method

            const resolve = await axiosSecure[method](parsed_url, {
                ...this.collectPayload(),
                ...this.collectParameters(),
            }, this.config)
            return resolve.data

        } catch (error) {
            if (error.response === undefined || error.response.data === undefined) {
                return { detail: error + "", api_status: false }
            }
            return error.response.data
        }
    }

} //class

export default ProgresoEstudio



