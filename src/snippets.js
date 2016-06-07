function c_bac(p, q) {
    //http://mathoverflow.net/questions/96493/computing-channel-capacities-for-non-symmetric-channels
    let z = Math.pow(2, (bin_h(p) - bin_h(q)) / (1 - p - q))
    return (Math.log2(1 + z) - 
        (1 - q) / (1 - p - q) * bin_h(p) +
        p / (1 - p - q) * bin_h(q))
}

describe('c_bac', () => {
    it('computes the channel capacity for a binary asymetric chan', () => {
        expect(info.c_bac(0, 0)).toEqual(1)
        expect(info.c_bac(1, 1)).toEqual(1)
        expect(info.c_bac(0.49999, 0.49999)).toEqual(0)
    })
    it('is in agreement with the general function', () => {
        let make_bac = (p, q) => [[1 - p, p], [q, 1 - q]]
        for (let p of [0, 0.7, 1]) {
            for (let q of [0, 0.3, 0.6, 1]) {
                expect(info.c_bac(p, q)).toBeCloseTo(info.c(make_bac(p, q)))
            }
        }
    })
})