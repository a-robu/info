'use strict'
const assert = require('assert')
const range = require('array-range')
const exception = require('./exception')

function compare_floats(actual, expected, precision) {
    precision = precision || 2
    return Math.abs(expected - actual) < (Math.pow(10, -precision) / 2)
    //copied from 
    //https://github.com/jasmine/jasmine/blob/v2.0.4/src/core/matchers/toBeCloseTo.js
}

function list_sizes_match(a, b) {
    return a.length == b.length
}

function expand_args(f, args) {
    return args => f.apply(this, args)
}

function is_table(table) {
    if (!Array.isArray(table)) {
        return false
    }
    if (!table.every(Array.isArray)) {
        return false
    }
    if (!consistent_rows(table)) {
        return false
    }
    return true
}

function consistent_rows(table) {
    const length = table[0].length
    return table.every(row => row.length == length)
}

function table_sizes_match(a, b) {
    assert(is_table(a) && is_table(b), 'arguments must be tables')
    return (a.length == b.length)
        && (a[0].length == b[0].length)
}

function blank_table(rows, cols, val) {
    let result = []
    for (let i of range(rows)) {
        let row = []
        for (let j of range(cols)) {
            row.push(val)
        }
        result.push(row)
    }
    return result
}

function table_all(booly_table) {
    for (let row of booly_table) {
        for (let element of row) {
            if (!element) {
                return false
            }
        }
    }
    return true
}

function table_pair_compare(a, b, compare) {
    if (!table_sizes_match(a, b)) {
        throw exception.SizeMismatch
    }
    let bools = blank_table(a.length, a[0].length, 0)
    for (let i of range(a.length)) {
        for (let j of range(a[0].length)) {
            bools[i][j] = compare(a[i][j], b[i][j])
        }
    }
    return bools
}

exports.blank_table = blank_table
exports.consistent_rows = consistent_rows
exports.is_table = is_table
exports.list_sizes_match = list_sizes_match
exports.table_sizes_match = table_sizes_match
exports.table_all = table_all
exports.table_pair_compare = table_pair_compare
exports.custom_matchers = {
    toBeTable: function(util, customEqualityTesters) {
        return {
            compare: function(actual) {
                let result = {}
                result.pass = is_table(actual)
                return result
            }
        }
    },
    toTableEqual: function(util, customEqualityTesters) {
        return {
            compare: function(actual, expected) {
                let result = {}
                result.pass = table_pair_compare(actual, expected, compare_floats)
                return result
            }
        }
    }
}
