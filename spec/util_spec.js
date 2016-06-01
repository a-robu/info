const vec_matchers = require('../src/vec_matchers')
const sets_equal = require('../src/util').sets_equal

const util = require('../src/util')

beforeEach(() => {
    jasmine.addMatchers({
        toVecEqual: vec_matchers.toVecEqual
    })
})

describe('sum', () => {
    it('adds numbers in a list', () => {
        expect(util.sum([1, 2, 3])).toEqual(6)
    })
})

describe('object_map', () => {
    it('applies the function to all the values', () => {
        expect(util.object_map({
            'a': 3,
            'b': 4,
            'c': 5
        }, x => x + 1)).toEqual({
            'a': 4,
            'b': 5,
            'c': 6
        })
    })
    it('passes keys as args', () => {
        expect(util.object_map({
            2: 3
        }, (val, key) => val * (parseFloat(key) + 1))).toEqual({2: 9})
    })
})

describe('range', () => {
    it('returns a list of numbers', () => {
        expect(util.range(1, 4)).toEqual([1, 2, 3])
    })
})

describe('vec_to_func', () => {
    it('wrapps a vector into a function', () => {
        const vec = {
            red: 1,
            blue: 2
        }
        expect(util.vec_to_func(vec)('red')).toEqual(1)
        expect(util.vec_to_func(vec)('blue')).toEqual(2)
        expect(util.vec_to_func(vec)('The color of Love')).toBe(undefined)
    })
})

describe('table_notation', () => {
    it('returns a joint p dist given table notation', () => {
        expect(util.table_notation([
            [6, 7],
            [8, 9]
        ])).toVecEqual({
            [JSON.stringify([0, 0])]: 6,
            [JSON.stringify([0, 1])]: 7,
            [JSON.stringify([1, 0])]: 8,
            [JSON.stringify([1, 1])]: 9
        })
    })
})

describe('make_vec', () => {
    it('compiles the values of the func in a vec', () => {
        expect(util.make_vec(new Set([1, 3, 5]), x => x * x)).toEqual({
            1: 1,
            3: 9,
            5: 25
        })
    })
})

describe('sets_union', () => {
    it('returns elements from both sets', () => {
        let actual = util.sets_union(new Set(['a']), new Set(['b']))
        expect(actual).toEqual(new Set(['a', 'b']))
    })
})