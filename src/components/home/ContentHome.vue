<script setup>
import home_1 from "@/assets/images/home-1.jpg"
import home_2 from "@/assets/images/home-2.jpg"

</script>

<template>
    <v-card min-height="86vh" class="mt-3" elevation="5">
      <v-card-text>
        <v-row justify="center">
          <v-col cols="auto" md="auto">
            <v-hover v-slot="{ isHovering, props }" close-delay="100">
              <v-card :elevation="isHovering ? 10 : 2" :class="{ 'on-hover': isHovering }" height="300" width="300"
                v-bind="props" class="ma-2">
                <v-img :src="home_1" class="as-img-home" gradient="to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)" cover>
                  <v-card-title class="text-white">
                    Medicina Interna
                  </v-card-title>
                  <v-divider color="white"></v-divider>
                  <v-card-text class="text-white">
                    Medicina Interna es una especialidad médica que se dedica a la atención integral del adulto enfermo,
                    enfocada al diagnóstico y el tratamiento no quirúrgico de las enfermedades que afectan a sus órganos
                    y sistemas internos, y a su prevención.
                  </v-card-text>
                </v-img>
              </v-card>
            </v-hover>
          </v-col>
          <v-col cols="auto" md="auto">
            <v-hover v-slot="{ isHovering, props }" >
              <v-card :elevation="isHovering ? 15 : 2" :class="{ 'on-hover': isHovering }" height="300" width="300"
                v-bind="props" class="ma-2" @click="console.log('hola')">
                <v-img :src="home_2" class="as-img-home" gradient="to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)" cover>
                  <v-card-title class="text-white">
                    Cirurgía
                  </v-card-title>
                  <v-divider color="white"></v-divider>
                  <v-card-text class="text-white">
                    Comprende el diagnóstico y tratamiento de enfermedades que se resuelven por procedimientos
                    quirúrgicos o potencialmente quirúrgicos tanto electivos como de urgencia, en los siguientes
                    aparatos: digestivo, piel y partes blandas, pared abdominal y retroperitoneo.
                  </v-card-text>
                </v-img>
              </v-card>
            </v-hover>
          </v-col>

        </v-row>
      </v-card-text>
    </v-card>

</template>

<style scoped>
.as-img-home {
  width: 350px;
  height: 350px;
}
</style>


