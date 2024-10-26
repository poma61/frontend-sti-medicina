import { fetchSecure } from "@/http/connection/fetchHTTP"
import Tema from "@/http/api/Tema"

class ActividadTema {
    constructor() {
        this.endpoint = {
            generate_questions_ai: { url: "internado-root/ai-generate-questions/", method: "POST" },
            evaluate_questions_ai: { url: "internado-root/ai-evaluate-questions/", method: "POST" },
        }
        this.config = {
            headers: { 
                "Content-Type": "application/json",
            },
        }
    }
    //genera cuestionario por la IA
    async generateQuestionsAI(tema = new Tema()) {
        try {
            const generate_questions_ai = this.endpoint.generate_questions_ai // endpoint
            const response = await fetchSecure(generate_questions_ai.url, {
                method: generate_questions_ai.method,
                ...this.config,
                body: JSON.stringify({
                    ...tema.collectPayload(),
                }),
            })

            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            // Retornamos el reader para que pueda ser utilizado en el componente
            return { reader, decoder }
        } catch (error) {
            throw new Error(error.message);
        }
    }
    //califica el cuestionario por la IA
    async evaluateQuestionsAI(questions = [], tema = new Tema()) {
        try {
            const evaluate_questions_ai = this.endpoint.evaluate_questions_ai // endpoint
            const response = await fetchSecure(evaluate_questions_ai.url, {
                method: evaluate_questions_ai.method,
                ...this.config,
                body: JSON.stringify({
                    questions: questions,
                    tema: {...tema.collectPayload()}
                }),
            })

            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
            }
            const reader = response.body.getReader(); // Para leer los fragmentos
            const decoder = new TextDecoder("utf-8");

            // Retornamos el reader para que pueda ser utilizado en el componente
            return { reader, decoder };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default ActividadTema

