function which_type(obj) {
    if (obj instanceof Set) {
        return 'Set'
    }
    else if (obj instanceof Array) {
        return 'Array'
    }
    return 'Other'
}

let transforms = {
    Set: obj => JSON.stringify(Array.from(obj).sort()),
    Array: obj => JSON.stringify(obj),
    Other: obj => obj
}

let handler = {
    get(target, property) {
        let type = which_type(property)
        return target[type][transforms[type](property)]
    },
    set(target, property, value) {
        let type = which_type(property)
        target[type][transforms[type](property)] = value
    }
}


module.exports = new Proxy(Object, {
    construct(target, args) {
        let blank_target = {}
        for (let type of Object.keys(transforms)) {
            blank_target[type] = {}
        }
        if (args.length >= 1) {
            blank_target['Other'] = args[0]
        }
        return new Proxy(blank_target, handler)
    }
})