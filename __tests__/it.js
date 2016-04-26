jest.unmock('../info')
jest.unmock('compute-sum')
const info = require('../info')

describe('plog', () => {
    it('calculates p * log2(p)', () => {
        expect(info.plogp(0.5)).toBe(-0.5)
        //because 0.5 * log2(0.5) = 0.5 * (- 1) = - 0.5
        expect(info.plogp(1)).toBe(0)
        //because 1 * log2(1) = 1 * 0 = 0
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
    it('normalizes by row', () => {
        expect(info.conditional_table([
            [0.40, 0.40],
            [0.05, 0.15]
        ])).toAlmostEqual([
            [0.50, 1.50],
            [0.25, 0.75]
        ])
    })
})

describe('marginal_table', () => {})
