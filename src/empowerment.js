const info = require('./info')
const vec_to_func = require('./util').vec_to_func
const object_map = require('./util').object_map
const sets_union = require('./util').sets_union

function best_action(game, svec) {
    let best_action
    let best_empowerment = - 1
    for (let action in prob) {}
}

function blank_vec(keys) {
    let result = {}
    for (let key of keys) {
        result[key] = 0
    }
    return result
}

function lerp_vecs(vecs, weights) {
    let lerped = {}
    for (let key of Object.keys(vecs)) {
        lerped[key] = blank_vec(Object.keys(vecs[key]))
        for (let i of Object.keys(vecs[key])) {
            lerped[key][i] += vecs[key][i] * weights[key]
        }
    }
    return lerped
}

function all_actions(game, states) {
    let list_of_sets = Array.from(states).map(action => game.succ(action))
    return list_of_sets.reduce((a, b) => sets_union(a, b))
}

function make_channel(game, svec) {
    let channel = {}
    let actions = all_actions(game, new Set(Object.keys(svec)))
    for (let action of actions) {
        channel[action] = lerp_vecs(object_map(svec, (_, s) => {
            return game.move(s, action)
        }), svec)
    }
    return channel
}

function evaluate_state(succ, svec) {
    return info.c(make_channel(succ, svec))
}

exports.best_action = best_action
exports.evaluate_state = evaluate_state
exports.make_channel = make_channel