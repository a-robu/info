let xoxo = require('../src/xoxo')
let o = require('../src/xoxo').o
let x = require('../src/xoxo').x

describe('roundtrip', () => {
    it('works on empty lists', () => {
        expect(xoxo.roundtrip([])).toEqual([])
    })

    it('works on lists that contain elements', () => {
        expect(xoxo.roundtrip([1, 3, 5])).toEqual([1, 3, 5])
    })

    it('works on empty sets', () => {
        expect(xoxo.roundtrip(new Set())).toEqual(new Set())
    })

    it('works on sets that contain elements', () => {
        expect(xoxo.roundtrip(new Set([1, 3, 5]))).toEqual(new Set([1, 5, 3]))
    })

    it('works on empty strings', () => {
        expect(xoxo.roundtrip('a str')).toEqual('a str')
    })

    it('works on strings, ints and floats', () => {
        expect(xoxo.roundtrip(5)).toEqual(5)
        expect(xoxo.roundtrip('a string')).toEqual('a string')
        expect(xoxo.roundtrip(9.3)).toEqual(9.3)
    })
})

describe('x', () => {
    it('takes multiple arguments', () => {
        expect(x(1, 2)).toEqual(xoxo.serialize([1, 2]))
    })
    it('throws an error if it cannot serialise that key', () => {
        expect(() => {
            x(new Int16Array())
        }).toThrowError(xoxo.CannotSerializeType)
    })
})

describe('o', () => {
    it('can reverse the action of x()', () => {
        expect(o(x(1, 2, 3))).toEqual([1, 2, 3])
    })
})

describe('absorb_values', () => {
    it('absorbs the one value', () => {
        expect(xoxo.absorb_values(x(1), ['a'])).toEqual({a: 1})
    })
    it('can handle nested stuff', () => {
        let xtree = x(x(1, 2), 3)
        expect(xoxo.absorb_values(xtree, [[1, 2], 3]))
    })
})

describe('imprint_values', () => {
    it('can imprint one value', () => {
        expect(xoxo.imprint_values({a: 1}, ['a'])).toEqual(x(1))
    })
    it('can handle trees', () => {
        let actual = xoxo.imprint_values({a: 1, b: 2, c: 3}, [['a', 'b'], 'c'])
        expect(actual).toEqual(x(x(1, 2), 3))
    })
})

describe('reorder_xtree', () => {
    it('leaves one element in its place', () => {
        expect(xoxo.reorder_xtree(x(1), ['a'], ['a'])).toEqual(x(1))
    })
    it('swaps three elements', () => {
        let actual = xoxo.reorder_xtree(
            x(1, 2, 3),
            ['a', 'b', 'c'],
            ['b', 'c', 'a']
        )
        expect(actual).toEqual(x(2, 3, 1))
    })
    it('opens trees', () => {
        let actual = xoxo.reorder_xtree(
            x(x(1, 2)),
            [['a', 'b']],
            ['a', 'b']
        )
        expect(actual).toEqual(x(1, 2))
    })
    it('closes trees', () => {
        let actual = xoxo.reorder_xtree(
            x(1, 2),
            ['a', 'b'],
            [['a', 'b']]
        )
        expect(actual).toEqual(x(x(1, 2)))
    })
})