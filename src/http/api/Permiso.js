import API from "@/http/api/API";

class Permiso extends API {
    constructor(permiso) {
        super()
        this.fields = {
            id: 0,
            name: "",
            is_type: "",
            code: "",
        }
        this.endpoints = {
            list: { url: "permiso/", method: "get" },
        }

        if (permiso != undefined) {
            this.loadPayload(permiso)
        }

    } // constructor
}

export default Permiso


