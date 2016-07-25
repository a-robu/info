let range = require('array-range')
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

function absorb_values(xtree, symbol_tree) {
    let decoded = o(xtree)
    let absorbed = {}
    for (let i of range(symbol_tree.length)) {
        let symbol = symbol_tree[i]
        let node = decoded[i]
        if (symbol instanceof Array) {
            let nested_absored = absorb_values(node, symbol)
            Object.assign(absorbed, nested_absored)
        }
        else {
            absorbed[symbol] = node
        }
    }
    return absorbed
}

function imprint_values(absorbed, target_tree) {
    let newtree = []
    for (let i of range(target_tree.length)) {
        let symbol = target_tree[i]
        if (symbol instanceof Array) {
            newtree[i] = imprint_values(absorbed, symbol)
        }
        else {
            newtree[i] = absorbed[symbol]
        }
    }
    return x(...newtree)
}

function reorder_xtree(encoded, old_tree, new_tree) {

    let absorbed = absorb_values(encoded, old_tree)
    return imprint_values(absorbed, new_tree)
}

function x() {
    return serialize([...arguments])
}

let o = unserialize

exports.roundtrip = obj => unserialize(serialize(obj))
exports.x = x
exports.o = o
exports.serialize = serialize
exports.unserialize = unserialize
exports.CannotSerializeType = CannotSerializeType
exports.absorb_values = absorb_values
exports.imprint_values = imprint_values
exports.reorder_xtree = reorder_xtree
