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

exports.plogp = plogp
exports.entropy = entropy
