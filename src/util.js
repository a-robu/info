exports.assert = require('assert')
exports.sum = require('compute-sum')
exports.object_map = require('object.map')
exports.range = require('array-range')
exports.values = require('object-values')
exports.all = require('array-all')
exports.sets_equal = require('sets-equal')
exports.vec_to_func = (vec) => {
    return (key) => vec[key]
}
exports.table_notation = (table) => {
    let vec = {}
    for (let xi of exports.range(table.length)) {
        for (let yi of exports.range(table[0].length)) {
            vec[JSON.stringify([xi, yi])] = table[xi][yi]
        }
    }
    return vec
}
exports.make_vec = (domain, f) => {
    let vec = {}
    for (let val of domain) {
        vec[val] = f(val)
    }
    return vec
}
exports.sets_union = (set_list) => {
    let result = new Set()
    for (let set in set_list) {
        for (let element in set) {
            result.add(element)
        }
    }
    return result
}