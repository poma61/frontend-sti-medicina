const isEmptyObject = (object) => {
    return Object.keys(object).length === 0
}

// modifica el objeto target agegando el source
const mergeIntoObject = (target, source) => {
    return Object.assign(target, source)
}

const strictlyAssignProperties = (target, source) => {
    let key
    for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key) && source[key] !== undefined) {
            target[key] = source[key]
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
