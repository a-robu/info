
// https://en.wikipedia.org/wiki/Bayesian_network
// The purpose of this class is to represent a 
// Bayesian network. As long as it is given some
// known joint distributions and the conditional
// probabilities of the graph, the `query()` method
// will compute a requested joint probability dist.
class Net {
    constructor(joints, conds) {
        this.joints = joints
        this.conds = conds
        this._cache = {}
    }
    
    query(nodes) {
        // returns joint
    }
    
    add() {
        throw new Error('Not implemented.')
    }
}

exports.module = Net