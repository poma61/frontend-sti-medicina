<script setup>
const emit =  defineEmits(['toCloseHelpDialog'])

</script>

<template>
    <v-card>
        <v-card-title class="bg-deep-purple-lighten-1">
            ¿Como usar TutorAI?
        </v-card-title>
        <v-card-text>
            <div class="pa-1 text-justify">
                <p>
                    TutorAI es una herramienta diseñada para asistir a los estudiantes que estan realizando el
                    Internado
                    Rotatorio, asi como tambien para estudiantes que se estan preparando para el Internado
                    Rotatorio.
                </p>
                <v-divider class="my-3"></v-divider>
                <strong class="tex-th6">Cómo escribir un prompt efectivo:</strong>

                <ol class="pl-10">
                    <li><strong>Sé claro y específico:</strong> Un prompt bien formulado es claro y directo. En
                        lugar de
                        "Explícame la hipertensión", utiliza prompts más específicos, como "¿Cuáles son los factores
                        de
                        riesgo y las complicaciones asociadas a la hipertensión en adultos mayores?"</li>
                    <li><strong>Utiliza términos médicos:</strong> El uso de terminología médica específica permite
                        que
                        el asistente comprenda mejor el contexto. Esto incluye términos técnicos, abreviaturas
                        estándar
                        y nombres de patologías o tratamientos.</li>
                    <li><strong>Pide ejemplos o pasos si es necesario:</strong> Si estás aprendiendo un
                        procedimiento o
                        protocolo, puedes solicitar ejemplos prácticos o una guía paso a paso. Por ejemplo, "¿Cuáles
                        son
                        los pasos clave en la administración de un tratamiento para la diabetes tipo 2?"</li>
                    <li><strong>Especifica el nivel de profundidad:</strong> Dependiendo de tu necesidad, puedes
                        solicitar un nivel de detalle mayor o menor. Por ejemplo, "Explícame de manera general las
                        causas del cáncer de pulmón" o "Describe en detalle la fisiopatología del cáncer de pulmón."
                    </li>
                </ol>
                <strong>Ejemplos:</strong>
                <ul class="pl-10">
                    <li>
                        Explícame los factores de riesgo y síntomas principales de la diabetes tipo 2.
                    </li>
                    <li>
                        ¿Cuáles son los tratamientos actuales para la hipertensión en adultos mayores?
                    </li>
                    <li>
                        ¿Cuál es el mecanismo de acción y los efectos secundarios comunes del ibuprofeno?
                    </li>
                    <li>
                        ¿Qué diferencias existen entre los inhibidores de la ECA y los bloqueadores de los
                        receptores de angiotensina II?
                    </li>
                </ul>

                <p class="text-body-2 mt-8">

                    <em>Un prompt es una instrucción o conjunto de palabras que proporcionamos a una
                        inteligencia artificial
                        (IA) para guiar la generación de una respuesta o salida específica. </em>
                </p>
            </div>
        </v-card-text>
        <v-card-actions>
            <v-btn variant="tonal" color="cyan-darken-1" @click="emit('toCloseHelpDialog')">
                <v-icon icon="mdi-close" />
                Cerrar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>