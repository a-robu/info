exports.assert = require('assert')
exports.sum = require('compute-sum')
exports.object_map = require('object.map')
exports.range = require('array-range')
exports.values = require('object-values')
exports.all = require('array-all')
exports.sets_equal = require('sets-equal')
exports.vec_to_func = (vec) => {
    return (key) => vec[key]
}