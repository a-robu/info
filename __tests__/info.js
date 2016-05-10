jest.unmock('../util')
jest.unmock('../info')
jest.unmock('../table_matching')
const util = require('../util')
const info = require('../info')
const table_matching = require('../table_matching')

describe('plog', () => {
    it('calculates p * log2(p)', () => {
        expect(info.plogp(0.5)).toBe(-0.5)
        expect(info.plogp(1)).toBe(0)
    })    
    it('handles p = 0, the math explosion', () => {
        expect(info.plogp(0)).toBe(0)
    })
})

describe('entropy', () => {
    it('calculates H(x), the ammount of entropy of a random var', () => {
        expect(info.entropy([0, 1])).toBe(0); // absolute certanty
        expect(info.entropy([0.5, 0.5])).toBe(1); //perfect coin toss
    });
});

describe('normalize', () => {
    it('makes a list sum up to 1', () => {
        expect(info.normalize([10, 10, 20])).toEqual([0.25, 0.25, 0.5])
    })
})

describe('conditional_table', () => {
    beforeEach(() => {
        jasmine.addMatchers(table_matching.custom_matchers)
    })
    it('returns something', () => {
        const obtained = info.conditional_table([[1]])
        expect(obtained).not.toBe(undefined)
    })
    it('returns a table', () => {
        const obtained = info.conditional_table([[1, 2], [3, 4], [5, 6]])
        expect(obtained).toBeTable()
    })
    it('returns a table of the same size', () => {
        const sample = [[0, 1], [2, 3], [4, 5]]
        expect(table_matching.table_sizes_match(
            info.conditional_table(sample), sample)).toBe(true)
    })
    it('normalizes by row', () => {
        expect(info.conditional_table([
            [0.40, 0.40],
            [0.05, 0.15]
        ])).toTableEqual([
            [0.50, 1.50],
            [0.25, 0.75]
        ])
    })
})

describe('uniform', () => {
    it('generates a fair coin', () => {
        expect(info.uniform(['up', 'down'])).toEqual({
            'up': 0.5,
            'down': 0.5
        })
    })
})

describe('expectation', () => {
    it('computes the expectation of a fair dice', () => {
        const fair_dice = info.uniform(range(1, 6))
        expect(info.expectation(fair_dice)).toBeCloseTo(3.5)
    })
})

