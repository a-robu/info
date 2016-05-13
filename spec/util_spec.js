const util = require('../src/util')

describe('sum', () => {
    it('adds numbers in a list', () => {
        expect(util.sum([1, 2, 3])).toEqual(6)
    })
})

describe('map', () => {
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