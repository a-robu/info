'use strict'
const sum = require('./util').sum
const values = require('./util').values
const range = require('./util').range
const object_map = require('./util').object_map
const make_vec = require('./util').make_vec
const vec_to_func = require('./util').vec_to_func

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

//E(f)
function func_ev(domain, f, p) {
    return sum(Array.from(domain).map(x => (p(x) > 0 ? p(x) * f(x): 0)))
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

function normalize(vec) {
    const precomputed_sum = sum(values(vec))
    if (precomputed_sum === 0) {
        throw new Error('Cannot normalize the zero vector.')
    }
    return object_map(vec, x => x / precomputed_sum)
}

//P(Y, Z|X = x) given P(X, Y, Z)
function lock_var(xyvec, i, val) {
    return normalize(slice(xyvec, i, val))
}

//P(X = x) given P(X, Y, Z)
function marginal(xyvec, i, val) {
    return sum(values(slice(xyvec, i, val)))
}

//P(X) given P(X, Y, Z)
function marginalize(xyvec, i) {
    const wanted_domain = decompose_space(xyvec)[i]
    return make_vec(wanted_domain, val => marginal(xyvec, i, val))
}

function i(p) {
    return Math.log2(1 / p)
}

//H(X)
function h(vec) {
    return func_ev(Object.keys(vec), i, vec_to_func(vec))
}

//E(X)
function ev(vec) {
    return func_ev(Object.keys(vec), parseFloat, vec_to_func(vec))
}

//H(X|Y)
function cond_h(xyvec, i) {
    const var_domain = decompose_space(xyvec)[i]
    const val_h = val => h(lock_var(xyvec, i, val))
    return func_ev(var_domain, val_h, val => marginal(xyvec, i, val))
}

//I(X;Y) given P(X, Y)
function mi(xyvec) {
    const x = marginalize(xyvec, 0)
    return h(x) - cond_h(xyvec, 0)
}

exports.slice = slice
exports.decompose_space = decompose_space
exports.func_ev = func_ev
exports.ev = ev
exports.uniform = uniform
exports.normalize = normalize
exports.lock_var = lock_var
exports.marginal = marginal
exports.marginalize = marginalize
exports.h = h
exports.cond_h = cond_h
exports.mi = mi
