const util = require('../src/util')
const info = require('../src/info')
const vec_matchers = require('../src/vec_matchers')


beforeEach(() => {
    jasmine.addMatchers({
        toVecEqual: vec_matchers.toVecEqual
    })
})

//            red    orange 
//  tomato    0.4    0.1
//  orange    0.2    0.3
const vegetable_color = {
    [JSON.stringify(['tomato', 'red'])]: 0.4,
    [JSON.stringify(['tomato', 'orange'])]: 0.1,
    [JSON.stringify(['orange', 'red'])]: 0.2,
    [JSON.stringify(['orange', 'orange'])]: 0.3,
}

describe('entropy', () => {
    it('calculates H(x), the ammount of entropy of a random var', () => {
        expect(info.entropy([0, 1])).toBe(0); // absolute certanty
        expect(info.entropy([0.5, 0.5])).toBe(1); //perfect coin toss
    });
});

describe('normalize', () => {
    it('makes a vec sum up to 1', () => {
        expect(info.normalize({
            'a': 10, 
            'b': 10, 
            'c': 20
        })).toVecEqual({
            'a': 0.25,
            'b': 0.25,
            'c': 0.5
        })
    })
})

describe('slice', () => {
    it('returns a slice of the p. space without normalizing', () => {
        expect(info.slice(vegetable_color, 'orange')).toEqual({
            'tomato': 0.1,
            'orange': 0.3
        })
    })
})

describe('cond_vec', () => {
    it('returns the p dist of x after given a value for y', () => {
        expect(info.cond_vec(vegetable_color, 'orange')).toVecEqual({
            'tomato': 1 / 4,
            'orange': 3 / 4
        })
    })
})

// describe('conditional_vec', () => {
//     it('computes the P(X|Y=y) p. distribution', () => {
//         //            red    orange 
//         //  tomato    0.4    0.1
//         //  orange    0.2    0.3
//         expect(info.conditional_vec(vegetable_color)
//     })
// })

describe('uniform', () => {
    it('generates a fair coin', () => {
        expect(info.uniform(['up', 'down'])).toEqual({
            'up': 0.5,
            'down': 0.5
        })
    })
})

describe('expectation', () => {
    it('computes the expectation of a fair dice', () => {
        const fair_dice = info.uniform(util.range(1, 7))
        expect(info.expectation(fair_dice)).toBeCloseTo(3.5)
    })
})

// describe('outcomes', () => {
//     it('returns a map of x posteriors after measuring y', () => {
        //            red    orange 
        //  tomato    0.4    0.1
        //  orange    0.2    0.3
        //       
        // expect(info.outcomes({
        //     [JSON.stringify(['tomato', 'red'])]: 0.4,
        //     [JSON.stringify(['tomato', 'orange'])]: 0.1,
        //     [JSON.stringify(['orange', 'red'])]: 0.2,
        //     [JSON.stringify(['orange', 'orange'])]: 0.3,
        // })).toEqual({
        //     'red': {
        //         'tomato': 3 / 2,
        //         'orange': 1 / 2
        //     },
        //     'orange': {
        //         'tomato': 1 / 4,
        //         'orange': 3 / 4
        //     }
        // })
        
        // bayes(joint, red)
        //     -> 'tomato'
        //         'orange'
        
        //E(jointp) use (y set) (y p)
        // E_yp y -> H(outcome_after_y)
        
        // E      Y OUTCOME 
                        // VAL-> P(X|y) apply H()
                        // P-> P(y)
                        
        // expectation(yset -> p, valmapper H(condp))
                        
        
        // E(condp)
        
        // marginalize_y -> red -> 0.6
        
        //decompose_space()[1]
        // left = decompose_space[0]
        // right = decompose_space[1]
        // iterate over right
        //     (left, right) / p(red)
        //     #
            
            
        // conditional_p()
        
        // pick_second()
        // bucket(joint_space, refine_y)
        
        // H{cond_p() * cond_vec()}
        // marginalize(y)[k] * conditional_vec(joint,
        
        
        // marginal_p()
         
//     })
// })