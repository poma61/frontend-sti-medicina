// Función para envolver middleware con parámetros
//middleware => Este es el nombre de la función que estamos definiendo.
//(withParams, ...params) => Esta parte de la función indica que toma dos argumentos: withParams y un número variable de parámetros adicionales (...params).
// withParams es la función middleware original, y ...params es un array que contiene los parámetros adicionales.
//Luego, devuelve una nueva función que toma los parámetros típicos de un guardia de navegación Vue Router (to, from, next), 
//y finalmente, llama a la función middleware original (withParams), pasándole los parámetros originales junto
// con los parámetros adicionales utilizando el operador de propagación (...params).

// export const middleware = (withParams, ...params) => (to, from ,next) =>withParams(to, from ,next, ...params)
export const middleware = (withParams, ...params) => (to, from, next) => withParams(to, from, next, ...params)
