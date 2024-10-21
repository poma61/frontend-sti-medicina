import API from "@/http/api/API";

class Estudiante extends API {
    constructor(estudiante) {
        super()
        this.fields = {
            usuario: {
                id: 0,
                uuid: "",
                user: "",
                password: "",
                email: "",
                is_active: true,
                user_type: "estudiante",
                picture: null,
            },
            nombres: "",
            apellido_paterno: "",
            apellido_materno: "",
            ci: "",
            ci_expedido: "",
            genero: "",
            fecha_nacimiento: "",
            numero_contacto: 0,
            direccion: "",
            matricula_univ: 0,
            internado_rot: "",
            observaciones: "",
        }
        this.endpoints = {
            list: { url: "user/estudiante/", method: "get" },
            create: { url: "user/estudiante/", method: "post" },
            update: { url: "user/estudiante/<usuario.uuid>/", method: "put" },
            delete: { url: "user/estudiante/<usuario.uuid>/", method: "delete" },
        }

        this.config = {
            "headers": {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data', // de esta forma podemos enviar imagenes
            }
        }
        if (estudiante !== undefined) {
            this.loadPayload(estudiante)
        }

    } // constructor
}

export default Estudiante


