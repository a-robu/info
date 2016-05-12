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

//H(X)
function entropy(vec) {
    return - util.sum(util.values(vec).map(plogp))
}

function slice_along(xyvec, lock_along_i, val) {
    let result = {}
    for (let state_str of Object.keys(xyvec)) {
        let state_list = JSON.parse(state_str)
        if (state_list.length > 2) {
            throw new Error('Not implemented 3-dimensional state space')
        }
        if (state_list[lock_along_i] == val) {
            result[state_list[1 - lock_along_i]] = xyvec[state_str]
        }
    }
    return result
}

function slice(xyvec, yval) {
    return slice_along(xyvec, 1, yval)
}

// function slice_xy(xyvec, yval) {
//     return slice(xyvec, 0, 1, yval)
// }

//P(X|Y = y)
function cond_vec(xyvec, yval) {
    return normalize(slice(xyvec, yval))
}

function cond_p(xyvec, yval) {
    return sum(values(slice_along(xyvec, 1, val)))
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

//H(X|Y)
function cond_entropy(xyvec) {
    let yset = decompose_space(xyvec)[1]
    let prob_to_entropy = {}
    for (let yval of yset) {
        prob_to_entropy[cond_p(xyvec, yval)] = entropy(cond_vec(xyvec, yval))
    }
    return expectation(prob_to_entropy)
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

//E(X)
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

//P(ith)
function marginalize(xyvec, i) {
    let vec = {}
    //... I need a diagram. LOL
    for (let val of decompose_space(xyvec)[i]) {
        vec[val] = sum(values(slice_along(xyvec, i, val)))
    }
    return vec
}

//I(X;Y)
function mutual_information(xyvec) {
    return entropy(marginalize(xyvec, 0)) - cond_entropy(xyvec)
}

// function alt_mi(xyvec) {
//     return sum(values(map(xyvec, str => {
//         let state_list = JSON.parse(str)
//         pxy = xyvec[str]
//         px = cond_p(state_list[0])
//         return 
//     })))
// }

//P(X = x)
function px(xyvec, x) {
    return pi(xyvec, 0, x)
}

//P(Y = y)
function py(xyvec, y) {
    return pi(xyvec, 1, y)
}

//P(I = j)
function pi(xyvec, i, j) {
    return sum(values(slice_along(xyvec, i, j)))
}

function mi(xyvec) {
    let px_precomputed = {}
    for (let ix of decompose_space(xyvec)[0]) {
        px_precomputed[ix] = px(xyvec, ix)
    }
    let py_precomputed = {}
    for (let iy of decompose_space(xyvec)[1]) {
        py_precomputed[iy] = py(xyvec, iy)
    }
    let sum = 0
    for (let xystr of Object.keys(xyvec)) {
        let [ix, iy] = JSON.parse(xystr)
        let pxy = xyvec[xystr]
        let px = px_precomputed[ix]
        let py = py_precomputed[iy]
        if (pxy) {
            sum += pxy * Math.log2(pxy / (px * py))
        }
    }
    return sum
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
exports.mutual_information = mutual_information
exports.mi = mi
exports.marginalize = marginalize
exports.joint_from_table = joint_from_table
