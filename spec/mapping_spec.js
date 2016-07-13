let Mapping = require('../src/mapping')

describe('Mapping', () => {
    it('works with sets', () => {
        let mapping = new Mapping()
        mapping[new Set([1, 2, 3])] = 'cat'
        expect(mapping[new Set([1, 2, 3])]).toEqual('cat')
    })

    it('works with sets regardless of their internal ordering', () => {
        let mapping = new Mapping()
        let original_set = new Set([1, 5, 3])
        let different_order = new Set([3, 1, 5])
        mapping[original_set] = 'x'
        expect(mapping[different_order]).toEqual('x')
    })

    it("returns undefined if it doesen't have the value", () => {
        let empty_mapping = new Mapping()
        expect(empty_mapping['does not exist']).toEqual(undefined)
    })

    it('works on lists', () => {
        let mapping = new Mapping()
        mapping[[1, 2]] = 'x'
        expect(mapping[[1, 2]]).toEqual('x')
    })

    it('accepts constructor parameter', () => {
        let prefilled = new Mapping({cat: 'dog'})
        expect(prefilled['cat']).toEqual('dog')
    })

    it('can be iterated over all its values of all types', () => {
        pending()
    })
})