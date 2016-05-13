## Usage

```javascript
let info = require('info')
info.h(uniform(new Set([1, 2, 3, 4, 5, 6]))) // -> 3.5
```

This is how you write a probability distributions
(mapping event names to probabilities).
```javascript
let fair_coin = {
  'up': 0.5,
  'down': 0.5
}
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
* **`h(vec)`** computes the entropy of a random variable H(X)
* **`mi(xyvec)`** computes I(X;Y), the mutual information between 
two random variables. The argument it takes
is the joint probability distribution.
* **`cond_h(xyvec, i)`** gives the conditional conditional entropy;
the entropy left in the *ith* variable after the another one is given.


## Development
Running `./init` will download a local copy of node and will also
run `./npm install`. You will be able to `./jasmine` test 
your changes.
