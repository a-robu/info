jest.unmock('../table_matching')
const table_matching = require('../table_matching')

describe('table_sizes_match', () => {
    it('returns true if the rows and columns match', () => {
        expect(table_matching.table_sizes_match([
            [1, 2, 3],
            [5, 6, 7]
        ], [
            ['x', 'y', 'z'],
            ['b', 'b', 'b']
        ])).toBeTrue()
    })
})
