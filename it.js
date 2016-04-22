const sum = require('compute-sum')


function plogp(p) {
    if (p === 0) {
        return 0;
    }
    //plogp(0) is defined 0 in
    //applications in information theory
    return p * Math.log2(p)
}

function InvalidPDistException() {}

function entropy(pdist) {
    if (sum(pdist) !== 1) {
        throw InvalidPDistException
    }
    return - sum(pdist.map(plogp))
}

exports.plogp = plogp
exports.InvalidPDistException = InvalidPDistException
exports.entropy = entropy
