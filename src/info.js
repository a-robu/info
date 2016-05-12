'use strict'
const util = require('./util')
const sum = require('./util').sum
const values = require('./util').values
const range = require('./util').range

function plogp(p) {
    if (p === 0) {
        return 0;
    }
    //plogp(0) is defined 0 in
    //applications in information theory
    return p * Math.log2(p)
}

function entropy(vec) {
    return - util.sum(util.values(vec).map(plogp))
}

function slice(xyvec, yval) {
    let result = {}
    for (let rowstr of Object.keys(xyvec)) {
        let [x, y] = JSON.parse(rowstr)
        if (y == yval) {
            result[x] = xyvec[rowstr]
        }
    }
    return result
}

function cond_vec(xyvec, yval) {
    return normalize(slice(xyvec, yval))
}

function cond_p(xyvec, yval) {
    return sum(values(slice(xyvec, yval)))
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

function cond_entropy(xyvec) {
    let yset = decompose_space(xyvec)[1]
    let prob_to_entropy = {}
    for (let yval of yset) {
        prob_to_entropy[cond_p(xyvec, yval)] = entropy(cond_vec(xyvec, yval))
    }
    return expectation(prob_to_entropy)
}

function conditional_table(pxytable) {
    return pxytable.map(row => normalize(row))
}

function normalize(vec) {
    const precomputed_sum = util.sum(util.values(vec))
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

function expectation(vec) {
    return util.sum(util.values(util.object_map(vec, (p, num) => parseFloat(p) * num)))
}

function joint_from_table(table) {
    let vec = {}
    for (let xi of range(table.length)) {
        for (let yi of range(table[0].length)) {
            vec[JSON.stringify([xi, yi])] = table[xi][yi]
        }
    }
    return vec
}

exports.plogp = plogp
exports.entropy = entropy
exports.normalize = normalize
exports.expectation = expectation
exports.uniform = uniform
exports.slice = slice
exports.cond_vec = cond_vec
exports.cond_p = cond_p
exports.cond_entropy = cond_entropy
exports.decompose_space = decompose_space
exports.conditional_table = conditional_table
exports.joint_from_table = joint_from_table
