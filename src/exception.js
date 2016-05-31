// require('extend-error')

// function StateSpaceMismatch() {
//     this.name = "StateSpaceMismatch"
//     this.message = "The vectors should have the same keys."
// }
// StateSpaceMismatch.prototype = Error

exports.StateSpaceMismatch = {
    name: "StateSpaceMismatch",
    message: "The vectors should have the same keys.",
    stack: 'no stack for you!'
}

