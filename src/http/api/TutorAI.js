import { fetchSecure } from "@/http/connection/fetchHTTP"

class TutorAI {
    constructor() {
        this.endpoint = {
            tutor_ai: { url: "tutor-inteligente/", method: "POST" },
            text_to_speech: { url: "text-to-speech/", method: "POST" },
        }
        this.config = {
            headers: { 
                "Content-Type": "application/json",
            },
        }
    }

    async tutorAI(is_user_message, is_signal = null) {
        try {
            const resolve = await fetchSecure(this.endpoint.tutor_ai.url, {
                method: this.endpoint.tutor_ai.method,
                ...this.config,
                body: JSON.stringify({
                    user_message: is_user_message,
                }),
                signal: is_signal
            })
            if (!resolve.ok) {
                throw new Error("No se puede estabelecer comunicacion con TutorAI.")
            }

            const reader = resolve.body.getReader()
            const decoder = new TextDecoder("utf-8")

            return { reader, decoder }

        } catch (error) {
            throw new Error(error)
        }

    }

    async textToSpeech(is_text, is_signal = null) {
        try {
            const resolve =  await fetchSecure(this.endpoint.text_to_speech.url,{
             method: this.endpoint.text_to_speech.method,
             ...this.config,
             body:JSON.stringify({
               text:is_text
             }),   
             signal: is_signal
            })

            if(!resolve.ok){
                throw new Error("No se puedo obtener la voz de TutorAI")
            }
            const blob = await resolve.blob()
            const blob_url = URL.createObjectURL(blob)
            const audio = new Audio(blob_url)
            return audio

        } catch (error) {
           
            throw new Error(error)
        }
    }

}// TutorAI

export default TutorAI

