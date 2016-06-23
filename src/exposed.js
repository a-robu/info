let info = require('./info')
let empowerment = require('./empowerment')

exports.h = info.h
exports.mi = info.mi
exports.cond_h = info.cond_h
exports.c = info.c
exports.kl = info.kl
exports.util = {normalize: info.normalize}
exports.channels = {
    make_bac: info.make_bac
}
exports.emp = {
    best_action: empowerment.best_action,
    all_actions: empowerment.all_actions,
    evaluate_action: empowerment.evaluate_action,
    evaluate_state: empowerment.evaluate_state
}

