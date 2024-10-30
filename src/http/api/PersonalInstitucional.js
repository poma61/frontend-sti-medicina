import API from "@/http/api/API";

class PersonalInstitucional extends API {
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
                permisos: [],
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
            cargo: "",
            grado_academico: "",
            observaciones: "",
        }
        this.endpoints = {
            list: { url: "user/personal-institucional/", method: "get" },
            create: { url: "user/personal-institucional/", method: "post" },
            update: { url: "user/personal-institucional/<usuario.uuid>/", method: "put" },
            delete: { url: "user/personal-institucional/<usuario.uuid>/", method: "delete" },
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

export default PersonalInstitucional

