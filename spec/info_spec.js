const vec_matchers = require('../src/vec_matchers')
const table_notation = require('../src/util').table_notation
const sets_equal = require('../src/util').sets_equal 
const range = require('../src/util').range

const info = require('../src/info')

beforeEach(() => {
    jasmine.addMatchers({
        toVecEqual: vec_matchers.toVecEqual
    })
})

//            red    orange 
//  tomato    0.4    0.1
//  orange    0.2    0.3
const vegetable_color = {
    [JSON.stringify(['tomato', 'red'])]: 0.4,
    [JSON.stringify(['tomato', 'orange'])]: 0.1,
    [JSON.stringify(['orange', 'red'])]: 0.2,
    [JSON.stringify(['orange', 'orange'])]: 0.3,
}

//Hmm maybe an oop style would also work here :))
//VegCol.only('Veg')
//VegCol.only('Col').h()
//VegCol.mi()
//VegCol.vars() -> {'Veg', 'Col'}
//VegCol.space() -> {('tomato', 'red'), ...}
//VegCol['tomat', 'red']

describe('h', () => {
    it('calculates H(x), the ammount of entropy of a random var', () => {
        expect(info.h([0, 1])).toBe(0); // absolute certanty
        expect(info.h([0.5, 0.5])).toBe(1); //perfect coin toss
    });
});

describe('normalize', () => {
    it('makes a vec sum up to 1', () => {
        expect(info.normalize({
            'a': 10, 
            'b': 10, 
            'c': 20
        })).toVecEqual({
            'a': 0.25,
            'b': 0.25,
            'c': 0.5
        })
    })
    it('throws an error if the vector is just zeroes', () => {
        expect(() => {
            info.normalize({
                'a': 0,
                'b': 0
            })
        }).toThrow()
    })
})

describe('slice', () => {
    it('returns a slice of the p. space without normalizing', () => {
        expect(info.slice(vegetable_color, 1, 'orange')).toEqual({
            'tomato': 0.1,
            'orange': 0.3
        })
    })
})

describe('lock_var', () => {
    it('compute the p dist of vegetable after being given the color orange', () => {
        expect(info.lock_var(vegetable_color, 1, 'orange')).toVecEqual({
            'tomato': 1 / 4,
            'orange': 3 / 4
        })
    })
})

describe('marginal', () => {
    it('computes the probability that the object is an orange ', () => {
        expect(info.marginal(vegetable_color, 1, 'orange')).toBeCloseTo(4 / 10)
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

describe('ev', () => {
    it('computes the expectation of a fair dice', () => {
        const fair_dice = info.uniform(range(1, 7))
        expect(info.ev(fair_dice)).toBeCloseTo(3.5)
    })
})

describe('func_ev', () => {
    it('computes the expected value on a uniform p dist', () => {
        const domain = new Set([1, 2, 3])
        const f = x => x + 1
        const p = x => 1 / 3
        expect(info.func_ev(domain, f, p)).toBeCloseTo(3)
    })
    it('computes the expected value of a function that takes strings', () => {
        const domain = new Set(['red', 'green'])
        const f = function(x) {
            return (x == 'red') ? 1 : 2
        }
        const p = function(x) {
            return 1 / 2
        }
        expect(info.func_ev(domain, f, p)).toBeCloseTo(1.5)
    })
})

describe('cond_h', () => {
    it('computes the H(color|vegetable)', () => {
        expect(info.cond_h(vegetable_color, 1)).toBeCloseTo(0.8754)
    })
})

describe('marginalize', () => {
    it('marginalizes the first variable from a joint dist', () => {
        expect(info.marginalize(vegetable_color, 0)).toVecEqual({
            'tomato': 5 / 10,
            'orange': 5 / 10
        })
    })
    it('marginalizes the second variable from a joint dist', () => {
        expect(info.marginalize(vegetable_color, 1)).toVecEqual({
            'red': 6 / 10,
            'orange': 4 / 10
        })
    })
})

describe('mi', () => {
    it('returns 0 if the variables are independent', () => {
        expect(info.mi(table_notation([
            [0.25, 0.25],
            [0.25, 0.25]
        ]))).toBeCloseTo(0)
    })
    it('returns 1 for two matching coins', () => {
        expect(info.mi(table_notation([
            [0.5, 0],
            [0, 0.5]
        ]))).toBeCloseTo(1)
    })
})

describe('decompose_space', () => {
    beforeEach(() => {
        jasmine.addCustomEqualityTester((first, second) => {
            if (first instanceof Set && second instanceof Set) {
                return sets_equal(first, second)
            }
        })
    })
    it('decomposes states from join p dist', () => {
        expect(info.decompose_space(vegetable_color)).toEqual([
            new Set(['tomato', 'orange']),
            new Set(['red', 'orange'])
        ])
        expect(info.decompose_space(vegetable_color)).not.toEqual([
            new Set(['cabbage', 'rocket']),
            new Set(['doll', 'moon'])
        ])
    })
})