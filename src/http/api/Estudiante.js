import API from "@/http/api/API";


class Estudiante extends API {
    constructor() {
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
                picture: "",
            },
            nombres: "",
            apellido_paterno: "",
            apellido_materno: "",
            ci: "",
            ci_expedido: "",
            genero: "",
            fecha_nacimiento: "",
            numero_contacto: "",
            direccion: "",
            matricula_univ: "",
            internado_rot: "",
            obervaciones: "",
        }
        this.endpoints = {
            list: { url: "user/estudiante/", method: "get" },
            create: { url: "user/estudiante/", method: "post" },
            update: { url: "user/estudiante/<usuario.uuid>/", method: "put" },
            delete: { url: "user/estudiante/<usuario.uuid>/", method: "delete" },
        }
    }

}

export default Estudiante