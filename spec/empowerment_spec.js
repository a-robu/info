const empowerment = require('../src/empowerment')

function sharp_vec(i, size) {
    let blank = {}
    for (let _; _ < size; _++) {
        blank[_] = 0
    }
    blank[i] = 1
    return blank
}

let tunnel_game = {
    succ: function (pos) {
        return new Set(['go-left', 'stay-here', 'go-right'])
    },
    move: function(pos, action) {
        return {
            'go-left': sharp_vec(Math.max(0, pos - 1), 2),
            'stay-here': sharp_vec(pos, 2),
            'go-right': sharp_vec(Math.min(2, pos + 1))
        }[action]
    }
}

describe('best_action', () => {
    it('likes the center of a tiny tunnel', () => {
        expect(empowerment.best_action(tunnel_game, {0: 1})).toEqual('go-right')
        expect(empowerment.best_action(tunnel_game, {1: 1})).toEqual('stay-here')
        expect(empowerment.best_action(tunnel_game, {2: 1})).toEqual('go-left')
    })
})

describe('empowerment', () => {
    it('returns a number', () => {
        expect(empowerment.evaluate_state(tunnel_game, 0)).toEqual(jasmine.any(Number))
    })
})

describe('make_channel', () => {
    it('generates a cond p dist around a state using a succ function', () => {
        expect(empowerment.make_channel(tunnel_game, {0: 0.5, 1: 0.5})).toEqual({
            'go-left': {0: 1, 1: 0, 2: 0},
            'stay-here': {0: 0.5, 1: 0.5, 2: 0},
            'go-right': {0: 0, 1: 0.5, 2: 0.5}
        })
    })
})