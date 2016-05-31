const info = require('./info')
const vec_to_func = require('./util').vec_to_func
const object_map = require('./util').object_map

function best_action(game, svec) {
    let best_action
    let best_empowerment = - 1 
    // let probabilistic = prob_succ(succ, svec)
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
    // console.log(vecs, weights)
    let lerped = {}
    for (let key of Object.keys(vecs)) {
        lerped[key] = blank_vec(Object.keys(vecs[key]))
        for (let i of Object.keys(vecs[key])) {
            lerped[key][i] += vecs[key][i] * weights[key]
        }
    }
    return lerped
}

function make_channel(game, svec) {
    let channel = {}
    let actions = sets_union(Object.keys(svec).map(action => game.succ(action)))
    console.log({actions: actions})
    for (let action of actions) {
        actions[action] = lerp_vecs(object_map(svec, (_, s) => {
            console.log({
                s: s,
                action: action,
                d: game.move(s, action)
            })
            return game.move(s, action)
        }), svec)
    }
    return actions
}

function evaluate_state(succ, state) {
    return info.c(make_channel(succ, state))
}

exports.best_action = best_action
exports.evaluate_state = evaluate_state
exports.make_channel = make_channel