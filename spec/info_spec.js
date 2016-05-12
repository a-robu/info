const util = require('../src/util')
const info = require('../src/info')
const sets_equal = require('../src/util').sets_equal
const vec_matchers = require('../src/vec_matchers')


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

describe('entropy', () => {
    it('calculates H(x), the ammount of entropy of a random var', () => {
        expect(info.entropy([0, 1])).toBe(0); // absolute certanty
        expect(info.entropy([0.5, 0.5])).toBe(1); //perfect coin toss
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
        expect(info.slice(vegetable_color, 'orange')).toEqual({
            'tomato': 0.1,
            'orange': 0.3
        })
    })
})

describe('cond_vec', () => {
    it('returns the p dist of x after given a value for y', () => {
        expect(info.cond_vec(vegetable_color, 'orange')).toVecEqual({
            'tomato': 1 / 4,
            'orange': 3 / 4
        })
    })
})

describe('cond_p', () => {
    it('returns the p that y will take the give value', () => {
        expect(info.cond_p(vegetable_color, 'orange')).toBeCloseTo(4 / 10)
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
        const fair_dice = info.uniform(util.range(1, 7))
        expect(info.expectation(fair_dice)).toBeCloseTo(3.5)
    })
})

describe('cond_entropy', () => {
    it('computes H(X|Y)', () => {
        expect(info.cond_entropy(vegetable_color)).toBeCloseTo(0.8754)
    })
})

describe('joint_from_table', () => {
    it('returns a joint p dist given table notation', () => {
        expect(info.joint_from_table([
            [6, 7],
            [8, 9]
        ])).toVecEqual({
            [JSON.stringify([0, 0])]: 6,
            [JSON.stringify([0, 1])]: 7,
            [JSON.stringify([1, 0])]: 8,
            [JSON.stringify([1, 1])]: 9
        })
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

describe('mutual_information', () => {
    it('returns 0 if the variables are independent', () => {
        expect(info.mutual_information(info.joint_from_table([
            [0.25, 0.25],
            [0.25, 0.25]
        ]))).toBeCloseTo(0)
    })
    it('returns 1 for two matching coins', () => {
        expect(info.mutual_information(info.joint_from_table([
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