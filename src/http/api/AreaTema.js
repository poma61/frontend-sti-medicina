import API from "@/http/api/API";
// Falta este codigo hacer 

class AreaTema extends API {
    constructor(personal_institucional) {
        super()
        this.fields = {
            usuario: {
                id: 0,
                uuid: "",
                user: "",
                password: "",
                email: "",
                is_active: true,
                user_type: "",
                picture: null,
            },
            nombres: "",
            apellido_paterno: "",
            apellido_materno: "",
            ci: "",
            ci_expedido: "",
         
        }
        this.endpoints = {
            list: { url: "internado-root/area-and-tema/", method: "get" },
            read: { url: "internado-root/area-and-tema/<area.name>/uuid/", method: "get" }, // crear metodo read()
        }

        this.config = {
            "headers": {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data', // de esta forma podemos enviar imagenes
            }
        }
        if (personal_institucional !== undefined) {
            this.loadPayload(personal_institucional)
        }

    } // constructor
}

export default AreaTema



