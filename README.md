## Usage

This is how you write a probability distribution
(mapping event names to probabilities).
```javascript
let fair_coin = {
  'up': 0.5,
  'down': 0.5
}
```

This is how you compute the entropy of a fair coin throw.
```javascript
info.h(fair_coin)
```

This is how you write a joint probability distribution:
```javascript
//            red    orange 
//  tomato    0.4    0.1
//  orange    0.2    0.3
const vegetable_color = {
    [JSON.stringify(['tomato', 'red'])]: 0.4,
    [JSON.stringify(['tomato', 'orange'])]: 0.1,
    [JSON.stringify(['orange', 'red'])]: 0.2,
    [JSON.stringify(['orange', 'orange'])]: 0.3,
}
```

Functions included:
* **`h(vec)`** computes the 
[entropy](https://en.wikipedia.org/wiki/Entropy_(information_theory)) 
of a random variable H(X)
* **`mi(xyvec)`** computes I(X;Y), the 
[mutual information](https://en.wikipedia.org/wiki/Mutual_information)
 between two random variables. The argument it takes
is the joint probability distribution.
* **`cond_h(xyvec, i)`** computes the 
[conditional entropy](https://en.wikipedia.org/wiki/Conditional_entropy)
 H(X|Y); the entropy left in the *ith* variable after the another one is given.
* **`c(channel)`** computes the 
[channel capacity](https://en.wikipedia.org/wiki/Channel_capacity) 
of the channel using the *Blahut–Arimoto* algorithm.
* **`kl(pxvec, pyvec)`** computes the 
[Kullback–Leibler divergence](https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence)

And some other empowerment related stuff:
```
exports.emp = {
    best_action: empowerment.best_action(game, svec),
    all_actions: empowerment.all_actions(game, svec),
    evaluate_action: empowerment.evaluate_action(game, svec, action)
}
```

## Development
Run `npm test` for jasmine unit tests.

You can `source enter_env` to get `node` into your path. You can then
`node --debug-brk jasmine.js` to debug the unit tests.
