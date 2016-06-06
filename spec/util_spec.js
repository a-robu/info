const vec_matchers = require('../src/vec_matchers')
const sets_equal = require('../src/util').sets_equal
const values = require('../src/util').values
const vec_to_func = require('../src/util').vec_to_func

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

describe('blank_vec', () => {
    it('returns a vector with the same keys as the set it is given', () => {
        let set = new Set(['x', 'y', 'z'])
        expect(new Set(Object.keys(util.blank_vec(set)))).toEqual(set)
    })
    it('returns a zeroes vector', () => {
        expect(values(util.blank_vec(['a', 'b', 'c']))).toEqual([0, 0, 0])
    })
})

describe('lerp_vecs', () => {
    it('returns a returns a linear combination of vectors', () => {
        expect(util.lerp_vecs([
            {'a': 0.1, 'b': 0.9},
            {'a': 0.5, 'b': 0.5}
        ], {0: 0.5, 1: 0.5})).toEqual(
            {'a': 0.3, 'b': 0.7}
        )
    })
    it('uses zero for missing values of when lerping', () => {
        expect(util.lerp_vecs([
            {'a': 1},
            {'b': 1}
        ], {0: 0.5, 1: 0.5})).toEqual({'a': 0.5, 'b': 0.5})
    })
})

describe('many_sets_union', () => {
    it('returns the union of a list of sets', () => {
        expect(util.many_sets_union([
            new Set(['a', 'b']),
            new Set(['b', 'c']),
            new Set(['d', 'e'])
        ])).toEqual(new Set(['a', 'b', 'c', 'd', 'e']))
    })
})

describe('vec_strip_zeroes', () => {
    it('returns a new vector without the zero components', () => {
        expect(util.vec_strip_zeroes({'a': 0, 'b': 1})).toEqual({'b': 1})
    })
})

describe('max', () => {
    it('returns the max value of a list', () => {
        expect(util.max([1, 2, 3, 2])).toEqual(3)
    })
    it('can also iterate over a set', () => {
        expect(util.max(new Set([1, 2, 3, 2]))).toEqual(3)
    })
    it('accepts key function as an argument', () => {
        expect(util.max([1, 2, 3, 2], x => - x)).toEqual(1)
    })
    it('works on other kinds of values', () => {
        let vals = ['a', 'b', 'c']
        let keyfunc = vec_to_func({a: 2, b: 3, c: 1})
        expect(util.max(vals, keyfunc)).toEqual('b')
    })
})