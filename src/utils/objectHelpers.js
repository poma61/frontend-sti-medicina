const isEmptyObject = (object) => {
    return Object.keys(object).length === 0
}

// modifica el objeto target agegando el source
const mergeIntoObject = (target, source) => {
    return Object.assign(target, source)
}

const strictlyAssignProperties = (target, source) => {
    let key
    if (source !== null && source !== undefined && target !== undefined && target !== null) {
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key) && source[key] !== undefined && source[key] !== null && typeof source[key] !== 'object') {
                target[key] = source[key]
            }
        }
    }
    return target
}

// Función para verificar si al menos una de las propiedades (excluyendo el atributo excluded) tiene valor
// devuelve true si al menos una propiedad tiene un  valor
const hasPropertyWithValue = (object, excluded) => {
    let property
    for (property in object) {
        if (property !== excluded && object[property] !== "" && object[property] !== null && object[property] !== undefined) {
            return true
        }
    }
    return false
}

export {
    isEmptyObject,
    strictlyAssignProperties,
    hasPropertyWithValue,
    mergeIntoObject,
}
