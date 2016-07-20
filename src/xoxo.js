const ExtendableError = require('es6-error')

class CannotSerializeType extends ExtendableError {}

const TYPES = {
    JSON_FRIENDLY: 'j',
    ARRAY: 'a',
    SET: 's'
}

const JSON_FRIENDLY_TYPES = [
    'string', 'number'
]

function serialize(obj) {
    let type
    let for_json
    if (obj instanceof Array) {
        type = TYPES.ARRAY
        for_json = obj.map(serialize)
    }
    else if (obj instanceof Set) {
        type = TYPES.SET
        for_json = Array.from(obj).map(serialize).sort()
    }
    else if (JSON_FRIENDLY_TYPES.includes(typeof obj)) {
        type = TYPES.JSON_FRIENDLY
        for_json = obj
    }
    else throw new CannotSerializeType(`typeof: ${typeof obj}.`)
    return JSON.stringify([type, for_json])
}

function unserialize(str) {
    let [type, from_json] = JSON.parse(str)
    switch (type) {
        case TYPES.ARRAY:
            return from_json.map(unserialize)
        case TYPES.SET:
            return new Set(from_json.map(unserialize))
        case TYPES.JSON_FRIENDLY:
            return from_json
        default:
            throw `Unhandled type: ${type}`
    } 
}

exports.roundtrip = obj => unserialize(serialize(obj))
exports.x = function() {return serialize([...arguments])}
exports.o = unserialize
exports.serialize = serialize
exports.unserialize = unserialize
exports.CannotSerializeType = CannotSerializeType
