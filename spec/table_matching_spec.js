const table_matching = require('../src/table_matching')
const exception = require('../src/exception')

describe('list_sizes_match', () => {
    it('returns true if both lists have the same length', () => {
        expect(table_matching.list_sizes_match([
            1, 2, 3, 4
        ], [
            5, 6, 7, 8
        ])).toBe(true)
    })
})

describe('blank_table', () => {
    it('fills in the table with the value passed in', () => {
        expect(table_matching.blank_table(3, 2, 'x')).toEqual([
            ['x', 'x'],
            ['x', 'x'],
            ['x', 'x']
        ])
    })
})

describe('table_sizes_match', () => {
    it('returns true if the rows and columns match', () => {
        expect(table_matching.table_sizes_match([
            [1, 2, 3],
            [5, 6, 7]
        ], [
            [9, 9, 9],
            [9, 9, 9]
        ])).toBe(true)
    })
    it('returns false if one has more rows that the other', () => {
        expect(table_matching.table_sizes_match([
            [1, 2, 3]
        ], [
            [1, 2, 3],
            [4, 5, 6]
        ])).toBe(false)
    })
    it('returns false if one has more columns that the other', () => {
        expect(table_matching.table_sizes_match([
            [1],
            [2]
       ], [
            [1, 5],
            [2, 6]
       ])).toBe(false)
    })
})

describe('is_table', () => {
    it('returns true if the argument is a table', () => {
        expect(table_matching.is_table([[1, 2], [3, 4]])).toBe(true)
    })
    it('returns false if the argument is not an array', () => {
        expect(table_matching.is_table(2)).toBe(false)
    })
    it('returns false if some rows are not arrays', () => {
        expect(table_matching.is_table([
            [1, 2, 3],
            'dog'
        ])).toBe(false)
    })
    it('handles larger tables', () => {
        const sample = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]
        expect(table_matching.is_table(sample)).toBe(true)
    })
    it('checks that the table has consistent row lengths', () => {
        expect(table_matching.is_table([
            [1, 2, 3, 4],
            [5, 6]
        ])).toBe(false)
    })
})

describe('consistent_rows', () => {
    it('returns true if all rows are the same length', () => {
        expect(table_matching.consistent_rows([
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 0],
            [5, 4, 2, 3, 4]
        ])).toBe(true)
    })
    it('returns false if the rows have different lengths', () => {
        expect(table_matching.consistent_rows([
            [1, 2, 3, 4],
            [5, 6]
        ])).toBe(false)
    })
})

describe('table_all', () => {
    it('returns true if all entries are truthy', () => {
        expect(table_matching.table_all([
            [true, true, true],
            [true, true, true]
        ])).toBe(true)
    })
    it('returns false if some entries are falsy', () => {
        expect(table_matching.table_all([
            [true, true, false],
            [true, false, true]
        ])).toBe(false)
    })
})

describe('table_pair_compare', () => {
    it("throws an error if the table sizes don't match", () => {
        expect(() => {
            table_matching.table_pair_compare([
                [1, 2]
            ], [
                [1],
                [2]
            ])
        }).toThrow(exception.SizeMismatch)
    })
    it('handles larger tables', () => {
        const sample = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 1, 2, 3]
        ]
        const equality = (a, b) => a == b
        const actual = table_matching.table_pair_compare(
            sample, sample, equality
        )
        expect(actual).toEqual(table_matching.blank_table(3, 4, true))
    })
    it('returns a boolean table of function comparisons', () => {
        const table_a = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]
        const table_b = [
            [1, 2, -100],
            [55, 5, 6],
            [7, 0, 9]
        ]
        const equality = (a, b) => a == b
        expect(table_matching.table_pair_compare(
            table_a, table_b, equality
        )).toEqual([
            [true, true, false],
            [false, true, true],
            [true, false, true]
        ])
    })
})
