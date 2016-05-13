'use strict'
const util = require('./util')
const sum = require('./util').sum
const values = require('./util').values
const range = require('./util').range

//H(X)
function h(vec) {
    return values(vec).filter(p => p > 0).map(p => p * Math.log2(1 / p))
}

function slice(xyvec, var_i, val) {
    let result = {}
    for (let state_str of Object.keys(xyvec)) {
        let state_list = JSON.parse(state_str)
        if (state_list.length > 2) {
            throw new Error('Not implemented: handle 3-dimensional state space')
        }
        if (state_list[var_i] == val) {
            result[state_list[1 - var_i]] = xyvec[state_str]
        }
    }
    return result
}

function decompose_space(xyvec) {
    let vars = []
    for (let keystr of Object.keys(xyvec)) {
        let list = JSON.parse(keystr)
        for (let i of range(list.length)) {
            if (!vars[i]) {
                vars[i] = new Set()
            }
            vars[i].add(list[i])
        }
    }
    return vars
}

//P(Y, Z|X = x) given P(X, Y, Z)
function lock_var(xyvec, i, val) {
    return normalize(slice(xyvec, i, val))
}

//P(X = x) given P(X, Y, Z)
function marginal(xyvec, i, val) {
    return sum(values(slice(xyvec, i, val)))
}

//H(X|Y)
function cond_h(xyvec, i) {
    const var_domain = decompose_space(xyvec)[i]
    const val_h = val => h(lock_var(xyvec, i, val))
    return func_ev(var_domain, val_h, val => val_p(xyvec, i, val))
}

function normalize(vec) {
    const precomputed_sum = util.sum(util.values(vec))
    if (precomputed_sum === 0) {
        throw new Error('Cannot normalize the zero vector.')
    }
    return util.object_map(vec, x => x / precomputed_sum)
}

function uniform(iterable) {
    const set = new Set(iterable)
    const size = set.size
    let vector = {}
    for (let element of set) {
        vector[element] = 1 / size
    }
    return vector
}

//E(f)
function func_ev(domain, f, p) {
    return domain.map(x => p(x) * f(x))
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

//P(X) given P(X, Y, Z)
export function marginalize(xyvec, i) {
    const wanted_domain = decompose_space(xyvec)[i]
    return make_vec(wanted_domain, val => marginal(xyvec, i, val))
}

//I(X;Y) given P(X, Y)
function mi(xyvec) {
    const x = marginalize(xyvec, 0)
    return h(x) - cond_h(xyvec, 0)
}

// exports.plogp = plogp
// exports.h = h
// exports.normalize = normalize
// exports.ev = ev
// exports.func_ev = func_ev
// exports.uniform = uniform
// exports.slice = slice
// exports.cond_vec = cond_vec
// exports.cond_p = cond_p
// exports.cond_h = cond_h
// exports.decompose_space = decompose_space
exports.table_notation = table_notation
exports.marginalize = marginalize
exports.mi = mi
