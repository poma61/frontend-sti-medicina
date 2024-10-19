// styles vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// para traducciones
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createI18n, useI18n } from 'vue-i18n'

// importar las traducciones de vuetify
import esTranslations from 'vuetify/lib/locale/es.mjs'
import enTranslations from 'vuetify/lib/locale/en.mjs'

// la variable debe llamarse messages si o si, caso contrario hay errores
const messages = {
    es: {
        $vuetify: { ...esTranslations }
    },
    en: {
        $vuetify: { ...enTranslations }
    }
}

const i18n = new createI18n({
    legacy: false, // vuetify no soporta el modo heredado de vue-i18n
    locale:'es',
    fallbackLocale:'en',
    messages,
})


export default createVuetify({
    directives,
    components,
    locale:{
        adapter: createVueI18nAdapter({i18n, useI18n})
    } 
});
