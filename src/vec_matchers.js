const values = require('./util').values
const all = require('./util').all
const sets_equal = require('./util').sets_equal
const exception = require('./exception')

function compare_floats(actual, expected, precision) {
    precision = precision || 2
    return Math.abs(expected - actual) < (Math.pow(10, -precision) / 2)
    //copied from 
    //https://github.com/jasmine/jasmine/blob/v2.0.4/src/core/matchers/toBeCloseTo.js
}

function vec_diff(left, right) {
    const leftset = new Set(Object.keys(left))
    const rightset = new Set(Object.keys(right))
    if (!sets_equal(leftset, rightset)) {
        throw exception.DifferentKeys
    }
    let result = {}
    for (let k of Object.keys(left)) {
        result[k] = compare_floats(left[k], right[k])
    }
    return result
}

exports.toVecEqual = (util, customEqualityTesters) => {
    return {
        compare: (actual, expected) => {
            let result = {}
            result.pass = all(values(vec_diff(actual, expected)))
            return result
        }
    }
}