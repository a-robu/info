let xoxo = require('../src/xoxo')

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
        expect(xoxo.x(1, 2)).toEqual(xoxo.serialize([1, 2]))
    })
    it('throws an error if it cannot serialise that key', () => {
        expect(() => {
            xoxo.x(new Int16Array())
        }).toThrowError(xoxo.CannotSerializeType)
    })
})