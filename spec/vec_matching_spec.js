const vec_matchers = require('../src/vec_matchers')
const StateSpaceMismatch = require('../src/exception').StateSpaceMismatch

beforeEach(() => {
    jasmine.addMatchers({
        toVecEqual: vec_matchers.toVecEqual
    })
})

describe('toVecEqual', () => {
    it('does not match if the distributions are different', () => {
        expect({
            'a': 0.5,
            'b': 0.5
        }).not.toVecEqual({
            'a': 0.1,
            'b': 0.9
        })
    })
    it('matches floats that are almost equal', () => {
        expect({0: 1.000001}).toVecEqual({0: 1})
    })
    it('returns false if the state spaces do not match', () => {
        expect(() => {
            expect({
                'a': 1,
                'c': 2
            }).toVecEqual({
                'a': 1,
                'b': 2
            })
        }).toThrow(StateSpaceMismatch)
    })
})