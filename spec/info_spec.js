const vec_matchers = require('../src/vec_matchers')
const table_notation = require('../src/util').table_notation
const sets_equal = require('../src/util').sets_equal 
const range = require('../src/util').range

const x = require('../src/xoxo').x
const info = require('../src/info')

beforeEach(() => {
    jasmine.addMatchers({
        toVecEqual: vec_matchers.toVecEqual,
    })
    jasmine.addCustomEqualityTester((first, second) => {
        let make_set_to_str = (set) => {
            return () => 'Set ' + x(Array.from(set))
        }
        if (first instanceof Set && second instanceof Set) {
            let are_equal = sets_equal(first, second)
            if (!are_equal) {
                first.toString = make_set_to_str(first)
                second.toString = make_set_to_str(second)
            }
            return are_equal
        }
    })
})


//            red    orange 
//  tomato    0.4    0.1
//  orange    0.2    0.3
const vegetable_color = {
    [x('tomato', 'red')]: 0.4,
    [x('tomato', 'orange')]: 0.1,
    [x('orange', 'red')]: 0.2,
    [x('orange', 'orange')]: 0.3,
}

//Hmm maybe an oop style would also work here :))
//VegCol.only('Veg')
//VegCol.only('Col').h()
//VegCol.mi()
//VegCol.vars() -> {'Veg', 'Col'}
//VegCol.space() -> {('tomato', 'red'), ...}
//VegCol['tomat', 'red']


describe('outcome_i', () => {
	it('computes the surprisal of an event which was inevitable', () => {
		expect(info.outcome_i(1)).toEqual(0)
    })
})

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
    it('does not evaluate f if the probability is 0', () => {
		let spy = jasmine.createSpy()
		info.func_ev([0, 1], spy, x => x)
		expect(spy).not.toHaveBeenCalledWith(0)
    })
})

describe('map_ev', () => {
    it('also does not evaluate f if the probability is 0', () => {
		let spy = jasmine.createSpy()
		info.map_ev([0, 1], spy)
		expect(spy).not.toHaveBeenCalledWith(0)
    })
})

describe('cond_h', () => {
    it('computes the H(color|vegetable)', () => {
        expect(info.cond_h(vegetable_color, 1)).toBeCloseTo(0.8754)
    })
    it('works with blank columns', () => {
        expect(info.cond_h(table_notation([
            [0.5, 0],
            [0.5, 0]
        ]), 0)).toBeCloseTo(0)
    })
    it('works with blank rows', () => {
        expect(info.cond_h(table_notation([
            [0.5, 0.5],
            [0, 0]
        ]), 0)).toBeCloseTo(1)
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
    it('works with blank columns', () => {
        expect(info.mi(table_notation([
            [0.5, 0],
            [0.5, 0]
        ]))).toBeCloseTo(0)
    })
    it('works with blank rows', () => {
        expect(info.mi(table_notation([
            [0.5, 0.5],
            [0, 0]
        ]))).toBeCloseTo(0)
    })
})

describe('decompose_space', () => {
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

describe('blahut_step', () => {
    it('converges', () => {
        let channel = info.make_bac(0.5, 1)
        let far = [0.9, 0.1]
        let closer = info.blahut_step(channel, far)
        let even_closer = info.blahut_step(channel, closer)
        let first_error = info.blahut_error(channel, far, closer)
        let second_error = info.blahut_error(channel, closer, even_closer)
        expect(second_error).toBeLessThan(first_error)
    })
})

describe('blahut_mi', () => {
    it('computes the mi for a given channel and a given P(X)', () => {
        let nice_channel = {
            0: [1, 0],
            1: [0, 1]
        }
        let bad_idea = [1, 0]
        let good_idea = [0.5, 0.5]
        expect(info.blahut_mi(nice_channel, bad_idea)).toEqual(0)
        expect(info.blahut_mi(nice_channel, good_idea)).toEqual(1)
    })
})

describe('c', () => {
    it('computes the channel capacity of a perfect bit carrier', () => {
        let simple_channel = {
            0: {0: 1, 1: 0},
            1: {0: 0, 1: 1}
        }
        expect(info.c(simple_channel)).toBeCloseTo(1)
    })
    it('computes the channel capacity of a perfect bit flipper', () => {
        let flipper_channel = {
            0: {0: 0, 1: 1},
            1: {0: 1, 1: 0}
        }
        expect(info.c(flipper_channel)).toBeCloseTo(1)
    })
    it('computes the channel capacity of a really poor channel', () => {
        let very_poor_channel = {
            0: {0: 1, 1: 0},
            1: {0: 1, 1: 0}
        }
        expect(info.c(very_poor_channel)).toBeCloseTo(0)
    })
    it('computes correctly with a redundant input', () => {
        let phonetics = {
            'v': {'v': 1, 'f': 0, 'r': 0},
            'f': {'v': 1, 'f': 0, 'r': 0},
            'r': {'v': 0, 'f': 0, 'r': 1} 
        }
        expect(info.c(phonetics)).toBeCloseTo(1)
    })
})

describe('channel_transmitter_space', () => {
    it('returns the random variable of the transmitter as a set', () => {
        let channel = {
            'up': {},
            'down': {}
        }
        expect(info.channel_transmitter_space(channel)).toEqual(new Set(['up', 'down']))
    })
})

describe('apply_channel', () => {
    it('returns p(x) given p(x|y) and p(y)', () => {
        let after_rain = {
            'grass-wet': 0.8,
            'grass-dry': 0.2
        } 
        let after_not_rain = {
            'grass-wet': 0.3,
            'grass-dry': 0.7
        }
        let channel = {
            'it-rained': after_rain,
            'it-did-not-rain': after_not_rain
        }
        expect(info.apply_channel(channel, {'it-rained': 1})).toVecEqual(after_rain)
        expect(info.apply_channel(channel, {'it-did-not-rain': 1})).toVecEqual(after_not_rain)
    }) 
    it('lerps correctly', () => {
        let channel = {
            'a': {'x': 0.1},
            'b': {'x': 0.5}
        }
        expect(info.apply_channel(channel, {'a': 0.5, 'b': 0.5})).toVecEqual({'x': 0.3})
    })
})

describe('kl', () => {
    it('computes the dk divergence', () => {
        let p = [0.25, 0.75]
        let q = [0.5, 0.5]
        let actual = 0.18872187554
        expect(info.kl(p, q)).toBeCloseTo(actual)
    })
    it('is zero if p = q', () => {
        expect(info.kl([0.2, 0.4, 0.4], [0.2, 0.4, 0.4])).toEqual(0)
    })
    it('is zero if p = q', () => {
        let ideal = [0.1, 0.9]
        let close = [0.099, 0.901]
        let far = [0.]
        expect(info.kl([0.2, 0.4, 0.4], [0.2, 0.4, 0.4])).toEqual(0)
    })
    it('is positive if p != q', () => {
        expect(info.kl([0.9, 0.05, 0.05], [0.2, 0.4, 0.4])).toBeGreaterThan(0)
    })
})

describe('make_jointxy', () => {
    it('makes a joint p dist given a cond and a marginal', () => {
        expect(info.make_jointxy({
            'a': {
                'x': 0.5,
                'y': 0.5
            },
            'b': {
                'x': 0,
                'y': 1
            }
        }, {'a': 0.4, 'b': 0.6})).toVecEqual({
            [x('x', 'a')]: 0.5 * 0.4, 
            [x('y', 'a')]: 0.5 * 0.4,
            [x('x', 'b')]: 0 * 0.6,
            [x('y', 'b')]: 1 * 0.6
        })
    })
})

describe('bin_h', () => {
    it('computes the binary entropy function', () => {
        expect(info.bin_h(0)).toEqual(0)
        expect(info.bin_h(1)).toEqual(0)
        expect(info.bin_h(0.5)).toEqual(1)
    })
})

describe('repair_receiver_space', () => {
    it('fills in the zeroes in the reception distributions', () => {
        expect(info.repair_receiver_space({
            'go-left': {
                'left': 1
            },
            'go-right': {
                'right': 1
            },
            'get-confused': {
                'left': 0.5,
                'right': 0.5
            }
        })).toEqual({
            'go-left': {
                'left': 1,
                'right': 0
            },
            'go-right': {
                'left': 0,
                'right': 1
            },
            'get-confused': {
                'left': 0.5,
                'right': 0.5
            }
        })
    })
})

describe('bayes_update', () => {
    it('agrees with a hand-calculated experiment', () => {
        let prior = {baby: 0.9, mouse: 0.1}
        let physics = {
            baby: {large: 0.99, small: 0.01},
            mouse: {large: 0.15, small: 0.85}
        }
        //p(baby|large) = p(large|baby)p(baby) /Z
        //p(mouse|large) = p(large|mouse)p(mouse) /Z
        let expected = info.normalize({baby: 0.9 * 0.99, mouse: 0.1 * 0.15})
        let posterior = info.bayes_update(physics, prior, 'large')
        expect(posterior).toVecEqual(expected)
    })
})