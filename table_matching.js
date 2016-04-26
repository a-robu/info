"use strict";
const zip = require('zip-array')

function compare_floats(a, b, precision = 2) {
    return Math.abs(expected - actual) < (Math.pow(10, -precision) / 2)
    //copied from 
    //https://github.com/jasmine/jasmine/blob/v2.0.4/src/core/matchers/toBeCloseTo.js
}

function list_sizes_match(a, b) {
    return a.length == b.length
}

function table_sizes_match(a, b) {
    if (!list_sizes_match(a, b)) {
        return false;
    }
    return zip(a, b).every(list_sizes_match)
}

function table_pair_compare(a, b, compare) {
    
}

exports.table_sizes_match = table_sizes_match

exports.custom_matchers = {
    toTableEqual: function(util, customEqualityTesters) {
        return {
            compare: function(actual, expected) {
                let result = {}
                result.pass = true
                return result
            }
        }
    }
}
