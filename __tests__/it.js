jest.unmock('../it');
jest.unmock('compute-sum');
const entropy = require('../it').entropy;
const plogp = require('../it').plogp;

describe('plog', () => {
    it('calculates p * log2(p)', () => {
        expect(plogp(0.5)).toBe(-0.5)
        //because 0.5 * log2(0.5) = 0.5 * (- 1) = - 0.5
        expect(plogp(1)).toBe(0)
        //because 1 * log2(1) = 1 * 0 = 0
    })    
    it('handles p = 0, the math explosion', () => {
        expect(plogp(0)).toBe(0)
    })
})

describe('entropy', () => {
    it('calculates H(x), the ammount of entropy of a random var', () => {
        expect(entropy([0, 1])).toBe(0); // absolute certanty
        expect(entropy([0.5, 0.5])).toBe(1); //perfect coin toss
    });
});
