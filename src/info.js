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
    return sum(Array.from(domain).filter(x => p(x) > 0).map(x => p(x) * f(x)))
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


//I(X = x) self information associated with an outcome
function outcome_i(p) {
	if (p == 0) {
		throw new Error('this function is not defined for p(x) = 0')
	}
	return Math.log2(1 / p)
}

//E[F(P(X))]
function map_ev(vec, f) {
	//because the keys of vecs get turned into strings
	return func_ev(Object.keys(vec), x => f(vec[x]), vec_to_func(vec))
}

//H(X)
function h(vec) {
	return map_ev(vec, outcome_i)
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

function channel_transmitter_space(channel) {
    return new Set(Object.keys(channel)) 
}

function channel_receiver_space(channel) {
    //we're assuming that the channel object was passed in good,
    //that all the transmissions give the same receiver space (alphabet)
    let any_transmission = Object.keys(channel)[0]
    return new Set(Object.keys(channel[any_transmission]))
}

function c(channel) {
    let actions = channel_transmitter_space(channel)
    let locations = channel_receiver_space(channel)
    let vec = uniform(actions)
    let prev_computed_c = null
    let computed_c
    let d = (action, vec) => {
        return sum(Array.from(locations).map(location => {
            let cond = channel[action][location]
            let some_weird_calculation = sum(Array.from(actions).map(other_action => {
                return channel[other_action][location] * vec[other_action]
            }))
            return cond * Math.log2(cond / some_weird_calculation)
        }))
    }
    while (true) {
        vec = normalize(object_map(vec, (_, action, vec) => {
            return Math.pow(2, d(action, vec))
        }))
        computed_c = sum(Array.from(actions).map(action => vec[action] * d(action)))
        if (prev_computed_c !== null && Math.abs(computed_c - prev_computed_c) < 0.000001) {
            return computed_c
        }
        prev_computed_c = computed_c
    }
}

exports.slice = slice
exports.decompose_space = decompose_space
exports.func_ev = func_ev
exports.map_ev = map_ev
exports.ev = ev
exports.uniform = uniform
exports.normalize = normalize
exports.lock_var = lock_var
exports.marginal = marginal
exports.marginalize = marginalize
exports.outcome_i = outcome_i
exports.h = h
exports.cond_h = cond_h
exports.mi = mi
exports.channel_transmitter_space = channel_transmitter_space
exports.channel_receiver_space = channel_receiver_space
exports.c = c