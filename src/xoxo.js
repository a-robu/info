const CannotSerializeType = {
    name: "CannotSerializeType",
    message: "Serializing this type is not implemented."
}

const JSON_FRIENDLY_TYPES = [
    'string', 'number'
]

function serialize(obj) {
    let type
    let for_json
    if (obj instanceof Array) {
        type = 'Array'
        for_json = obj.map(serialize)
    }
    else if (obj instanceof Set) {
        type = 'Set'
        for_json = Array.from(obj).map(serialize).sort()
    }
    else if (JSON_FRIENDLY_TYPES.includes(typeof obj)) {
        type = 'json_friendly'
        for_json = obj
    }
    else throw CannotSerializeType.message += ` typeof: ${typeof obj}.`
    return JSON.stringify([type, for_json])
}

function unserialize(str) {
    let [type, from_json] = JSON.parse(str)
    switch (type) {
        case 'Array':
            return from_json.map(unserialize)
        case 'Set':
            return new Set(from_json.map(unserialize))
        case 'json_friendly':
            return from_json
        default:
            throw `Unhandled type: ${type}`
    } 
}

exports.roundtrip = obj => unserialize(serialize(obj))
exports.x = function() {return serialize([...arguments])}
exports.serialize = serialize
exports.unserialize = unserialize