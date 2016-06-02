const empowerment = require('../src/empowerment')

const _tunnel_game = require('../src/empowerment')._tunnel_game
const vec_matchers = require('../src/vec_matchers')

beforeEach(() => {
    jasmine.addMatchers({
        toProbEqual: vec_matchers.toProbEqual,
    })
})

describe('best_action', () => {
    it('likes the center of a tiny tunnel', () => {
        expect(empowerment.best_action(_tunnel_game, {0: 1})).toEqual('go-right')
        expect(empowerment.best_action(_tunnel_game, {1: 1})).toEqual('stay-here')
        expect(empowerment.best_action(_tunnel_game, {2: 1})).toEqual('go-left')
    })
})

describe('evaluate_state', () => {
    it('returns a number', () => {
        let actual = empowerment.evaluate_state(_tunnel_game, {0: 1})
        expect(actual).toEqual(jasmine.any(Number))
    })
})

describe('evaluate_action', () => {
    it('returns a number', () => {
        let actual = empowerment.evaluate_action(_tunnel_game, {0: 1}, 'go-right')
        expect(actual).toEqual(jasmine.any(Number))
    })
})

describe('all_actions', () => {
    it('returns all the actions possible from a set of states', () => {
        expect(empowerment.all_actions({succ: pos => {
            return pos == 'a'? new Set(['x']): new Set(['y'])
        }}, {a: 0.1, b: 0.9})).toEqual(new Set(['x', 'y']))
    })
})

describe('make_channel', () => {
    it('generates a cond p dist around a state using a succ function', () => {
        expect(empowerment.make_channel(_tunnel_game, {0: 0.5, 1: 0.5})).toEqual({
            'go-left': {0: 1, 1: 0, 2: 0},
            'stay-here': {0: 0.5, 1: 0.5, 2: 0},
            'go-right': {0: 0, 1: 0.5, 2: 0.5}
        })
    })
})

describe('probabilistic_move', () => {
    it('lerps the outcome of an action given a current state prob vector', () => {
        expect(empowerment.probabilistic_move(_tunnel_game, {
            0: 0.5, 1: 0.5
        }, 'go-right')).toProbEqual({0: 0, 1: 0.5, 2: 0.5})
    })
})