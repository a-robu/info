'use strict'
const util = require('./util')

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

//function conditional_entropy(pxytable) {
//    slice column from conditional table
//    from slice get p of slice relative to table
//    normalize the slice then take H(slice) giving H(X|Y=y)
//}

function conditional_table(pxytable) {
    return pxytable.map(row => normalize(row))
}

//function marginal_vector(pxytable) {
//    slice column and normalize
//}

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

exports.plogp = plogp
exports.entropy = entropy
exports.normalize = normalize
exports.expectation = expectation
exports.uniform = uniform
exports.slice = slice
exports.cond_vec = cond_vec
exports.conditional_table = conditional_table
