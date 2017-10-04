import json
from Naked.toolshed.shell import muterun_js

def _call(fname, args):
    argstring = "'" + json.dumps({
        'function': fname,
        'args': args
    }) + "'"
    response = muterun_js('./api.js', argstring)
    if response.exitcode != 0:
        raise Exception('Non zero exit code from API call.')
    parsed = json.loads(response.stdout.decode("utf-8"))
    if parsed[1]: # error
        raise Exception('API error: ' + parsed[1]['message'] + '\n' + json.dumps(parsed[1]['error']))
    return parsed[0]

def _to_pairs(dict):
    return list(dict.items())

def cond_mi(joint):
    ''' I(X;Y|Z) '''
    return _call('cond_mi', [_to_pairs(joint)])

def mi(joint):
    ''' I(X;Y) '''
    return _call('mi', [_to_pairs(joint)])

def h(pdist):
    ''' H(X) '''
    return _call('h', [pdist])