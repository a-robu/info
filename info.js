const sum = require('compute-sum')

function plogp(p) {
    if (p === 0) {
        return 0;
    }
    //plogp(0) is defined 0 in
    //applications in information theory
    return p * Math.log2(p)
}

function entropy(pdist) {
    return - sum(pdist.map(plogp))
}

function conditional_table(pxytable) {
    return pxytable.map(row => normalize(row))
}

function marginal_table(pxytable) {}

function normalize(pxvec) {
    const precomputed_sum = sum(pxvec)
    return pxvec.map(x => x / precomputed_sum)
}

exports.plogp = plogp
exports.entropy = entropy
exports.normalize = normalize
exports.conditional_table = conditional_table
