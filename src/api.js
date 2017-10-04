const info = require('./info.js')
const x = require('./xoxo').x

const fix = {
    joint: pairs => {
        let pdist = {}
        for (let [vars, p] of pairs) {
            pdist[x(...vars)] = p
        }
        return pdist
    }
}

const functions = {
    h: pdist => info.h(pdist),
    mi: joint => info.mi(fix.joint(joint)),
    cond_mi: joint => info.cond_mi(fix.joint(joint))
}

function parse(input) {
    let parsed = null
    let error = null
    try {
        return [JSON.parse(input), null]
    }
    catch (e) {
        // https://stackoverflow.com/questions/18391212/
        return [null, {
            message: 'Error encountered while parsing JSON argument to api.',
            error: JSON.parse(JSON.stringify(e, Object.getOwnPropertyNames(e)))
        }]
    }
}

function apply_args(f, args) {
    return [f(...args), null]
}

function call_function(fname, args) {
    if (functions.hasOwnProperty(fname)) {
        return apply_args(functions[fname], args)
    }
    else {
        return [null, {message: 'Function with name "' + fname + '" does not exist.'}]
    }
}

function input_acceptable(parsed) {
    return parsed.hasOwnProperty('function') && parsed.hasOwnProperty('args')
}

function create_response(input) {
    let result = {answer: '', error: null}
    const [parsed, parse_error] = parse(input)
    if (parse_error) {
        return [null, parse_error]
    }
    if (!input_acceptable(parsed)) {
        return [null, {message: 'API call needs both "function" and "args".'}]
    }
    const [function_result, function_error] = call_function(parsed.function, parsed.args)
    if (function_error) {
        return [null, function_error]
    }
    return [function_result, null]
}

function give_response(response) { 
    console.log(JSON.stringify(response))
}

give_response(create_response(process.argv[2]))