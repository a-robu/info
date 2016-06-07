const info = require('./info')
const vec_to_func = require('./util').vec_to_func
const object_map = require('./util').object_map
const sets_union = require('./util').sets_union
const lerp_vecs = require('./util').lerp_vecs
const max = require('./util').max

function best_action(game, svec) {
    return max(all_actions(game, svec), action => evaluate_action(game, svec, action))
}

function all_actions(game, svec) {
    let list_of_sets = Object.keys(svec).map(state => game.succ(state))
    return list_of_sets.reduce((a, b) => sets_union(a, b), new Set())
}

function probabilistic_move(game, svec, action) {
    let per_situation = object_map(svec, (_, s) => game.move(s, action))
    return lerp_vecs(per_situation, svec)
}

function make_channel(game, svec) {
    let channel = {}
    let actions = all_actions(game, svec)
    for (let action of actions) {
        channel[action] = probabilistic_move(game, svec, action)
    }
    return info.repair_receiver_space(channel)
}

function evaluate_state(game, svec) {
    return info.c(make_channel(game, svec))
}

function evaluate_action(game, svec, action) {
    let there = probabilistic_move(game, svec, action)
    return evaluate_state(game, there)
}

let _tunnel_game = {
    succ: function (pos) {
        return new Set(['go-left', 'stay-here', 'go-right'])
    },
    move: function(pos, action) {
        return {
            'go-left': {[Math.max(0, pos - 1)]: 1},
            'stay-here': {[pos]: 1},
            'go-right': {[Math.min(2, pos + 1)]: 1}
        }[action]
    }
}

exports.best_action = best_action
exports.evaluate_state = evaluate_state
exports.evaluate_action = evaluate_action
exports.make_channel = make_channel
exports.all_actions = all_actions
exports.probabilistic_move = probabilistic_move
exports._tunnel_game = _tunnel_game

if (!module.parent) {
    console.log('Testing on the tunnel game.')
    for (let i of [0, 1, 2]) {
        console.log({
            i: i,
            emp: evaluate_state(_tunnel_game, {[i]: 1})
        })
    }
}