import API from "@/http/api/API";
// Falta este codigo hacer 

class Tema extends API {
    constructor(tema) {
        super()
        this.fields = {
            area: {
                id: 0,
                name: "",
                description: "",
            },
            id: 0,
            uuid: "",
            title: "",
            short_title:"",
            description: "",
            contenido: "",
            archivo_pdf: "",
        }
        this.endpoints = {
            list: { url: "internado-root/all-tema/<area.name>/", method: "get" },
            read: { url: "internado-root/tema/<area.name>/<uuid>/", method: "get" }, 
        } 

        if (tema !== undefined) {
            this.loadPayload(tema)
        }
    } // constructor
}

export default Tema
