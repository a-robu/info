const range = require('array-range')
const values = require('object-values')

function vec_to_func(vec) {
    return (key) => vec[key]
}
function table_notation(table) {
    let vec = {}
    for (let xi of range(table.length)) {
        for (let yi of range(table[0].length)) {
            vec[JSON.stringify([xi, yi])] = table[xi][yi]
        }
    }
    return vec
}

function make_vec(domain, f) {
    let vec = {}
    for (let val of domain) {
        vec[val] = f(val)
    }
    return vec
}

function sets_union(set_a, set_b) {
    let result = new Set()
    for (let element of set_a) {
        result.add(element)
    }
    for (let element of set_b) {
        result.add(element)
    }
    return result
}

function blank_vec(keys) {
    let result = {}
    for (let key of keys) {
        result[key] = 0
    }
    return result
}

function many_sets_union (vecs_list) {
    return vecs_list.reduce((a, b) => {
        return sets_union(a, b)
    }, new Set())
}

function lerp_vecs(vecs, weights) {
    let all_keys = many_sets_union(values(vecs).map(vec => Object.keys(vec)))
    let lerped = blank_vec(all_keys)
    for (let vec_i of Object.keys(vecs)) {
        let vec = vecs[vec_i]
        for (let i of Object.keys(vec)) {
            lerped[i] += (vec[i] ? vec[i]: 0) * weights[vec_i]
        }
    }
    return lerped
}

function vec_strip_zeroes(vec) {
    let result = {}
    for (let key of Object.keys(vec)) {
        if (vec[key]) {
            result[key] = vec[key]
        }
    }
    return result
}

function max(list, key = x => x) {
    let max_val = Array.from(list)[0]
    for (let val of list) {
        let keyed_val = key(val)
        if (typeof keyed_val === "undefined") {
            throw new Error('Assertion failed: key must return a value.')
        }
        if (keyed_val > max_val) {
            max_val = val
        }
    }
    return max_val
}

function sharp_vec (i, size) {
    let blank = blank_vec(range(size))
    for (let _; _ < size; _++) {
        blank[_] = 0
    }
    blank[i] = 1
    return blank
}

exports.many_sets_union = many_sets_union
exports.lerp_vecs = lerp_vecs
exports.sharp_vec = sharp_vec
exports.max = max
exports.blank_vec = blank_vec
exports.vec_to_func = vec_to_func
exports.table_notation = table_notation
exports.make_vec = make_vec
exports.vec_strip_zeroes = vec_strip_zeroes
exports.sets_union = sets_union
exports.assert = require('assert')
exports.sum = require('compute-sum')
exports.object_map = require('object.map')
exports.range = require('array-range')
exports.values = require('object-values')
exports.all = require('array-all')
exports.sets_equal = require('sets-equal')