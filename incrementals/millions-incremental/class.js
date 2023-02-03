'use strict'
class Game {

    startpts = O(1)
    pts = O(1)
    lvl = O(1)
    mp = O(0)
    ip = O(0)
    ipow = O(0)
    ipowp = O(0)
    upgScaling = O(10)
    multiplier = O(2)
    maxpts = O(1)
    up = []
    spd = O(1)
    mpup = [
        // you can space arguments like this if you want, it's easier to read
        new MillionUpgrade('Reduce doubler cost scaling by 4',                                                                          1, true),
        new MillionUpgrade("Multiply each doubler's effect by 1.5",                                                                     1, true),
        new MillionUpgrade('Points reset to 1000 instead of 1, point gain multiplies by level^2',                                       1, () => g.mpup[0].paid.eq(1) && g.mpup[1].paid.eq(1)),
        new MillionUpgrade('Points gain multiplier is level^8 instead of level^2',                                                      6, () => g.mpup[2].paid.eq(1)),
        new MillionUpgrade('Reduce doubler cost scaling by another 2',                                                                  4, () => g.mpup[2].paid.eq(1)),
        new MillionUpgrade('Automatically buy doublers and level up if possible',                                                       0, () => g.mpup[3].paid.eq(1) && g.mpup[4].paid.eq(1)),
        new MillionUpgrade('Unspent Million Points^6 multiplies your point gain',                                                       6, () => g.mpup[5].paid.eq(1)),
        new MillionUpgrade("Multiply each doubler's effect by 2, reduce their cost scaling by 2, multiply point gain by 1 billion",     22,() => g.mpup[6].paid.eq(1)),
        new MillionUpgrade("Multiply point production by 10",                                                                           0, () => g.mpup[6].paid.eq(1)),
        new MillionUpgrade("Points gain is multiplied by level tetrated by 1.557, doubler cost doesn't subtract your points anymore",   25,() => g.mpup[7].paid.eq(1)),
        new MillionUpgrade("Points gain is multiplied by MP tetrated by 1.557 (Need 222 MP)",                                           100,()=> g.mpup[8].paid.eq(1) && g.mp.gte(222)),
        new MillionUpgrade("You gain an additional 0.1% of your total levels and MP per level up (Need: 10000 MP)",                     3600,()=>g.mpup[9].paid.eq(1) && g.mp.gte(10000)),
    ]
    ipup =[
        new IllionUpgrade("START. Begin producing Illion Power which multiplies point gain", 0, true)
    ]

    lastTick = Date.now()

    constructor() {this.resetUpgs()}

    resetUpgs() {
        this.up = []
        for (let i = 0; i < 4; i++)
            this.up.push(new Upgrade(10 ** (i + 1)))
        this.mpup = this.mpup.map((v, i) => (v.id = i, v))
    }
    resetMilUpgs() {
        for (let i = 0; i < this.mpup.length; i++)
            this.mpup[i].paid = O(0)
    }
    updateSpd() {
        this.spd = this.up.reduce((a,b) =>
            a.mul(b.mul)
        , O(1)).mul(O.pow(2, O.sub(1, g.lvl)))
    }

    wipe() {
        const g = new Game
        Object.keys(this).forEach(v => {
            this[v] = g[v]
        })
    }

}

class Upgrade {

    constructor(startCost = O(10)) {
        this.mul = O(1),
        this.cost = O(startCost)
    }

    buy() {
        if (g.pts.gte(this.cost)) {
            this.mul = this.mul.mul(g.multiplier)
            if (g.mpup[9].paid.eq(1)) {
            g.pts = g.pts
            } else {
            g.pts = g.pts.sub(this.cost)
            }
            this.cost = this.cost.mul(g.upgScaling)
            g.updateSpd()
        }
    }

}

class MillionUpgrade {

    paid = O(0)

    constructor(desc, cost, predicate=()=>true, id) {
        this.desc = desc // Description of the upgrade that you see in-game.
        this.cost = O(cost) // Cost of the upgrade.
        this.id = id
        this.predicate = predicate === true ? () => true : predicate // Function that returns true if buyable/unlocked    
    }

    buy() {
        if (O.gte(g.mp, this.cost) && !(this.paid.eq(1)) && this.predicate()) {
            console.log(this)
            g.mp = g.mp.sub(this.cost)
            this.paid = O(1)
            MillionUpgrade.effects[this.id]() // The "this" is the MillionUpgrade object. Just in case the object should be used
            $('mpup-' + this.id).setAttribute('paid', '')
        }
    }

    
    static effects = [
        /* Upg 1 */ () => {g.upgScaling = O(g.upgScaling).sub('4')},
        /* Upg 2 */ () => {g.multiplier = O(g.multiplier).mul(2)},
        /* Upg 3 */ () => {g.startpts = O(1e3)},
        /* Upg 4 */ () => {},
        /* Upg 5 */ () => {g.upgScaling = O(g.upgScaling).sub('2')},
        /* Upg 6 */ () => {},
        /* Upg 7 */ () => {},
        /* Upg 8 */ () => {g.multiplier = O(g.multiplier).mul(1.5); g.upgScaling = g.upgScaling.sub(2)},
        /* Upg 9 */ () => {},
        /* Upg 10*/ () => {},
        /* Upg 11*/ () => {},
        /* Upg 12*/ () => {},
        // function (thisArg) {...}
    ]

}

class IllionUpgrade {

    paid = O(0)

    constructor(desc, cost, predicate=()=>true, id) {
        this.desc = desc // Description of the upgrade that you see in-game.
        this.cost = O(cost) // Cost of the upgrade.
        this.id = id
        this.predicate = predicate === true ? () => true : predicate // Function that returns true if buyable/unlocked    
    }

    buy() {
        if (O.gte(g.ip, this.cost) && !(this.paid.eq(1)) && this.predicate()) {
            console.log(this)
            g.ip = g.ip.sub(this.cost)
            this.paid = O(1)
            IllionUpgrade.effects[this.id]() // The "this" is the IllionUpgrade object. Just in case the object should be used
            $('ipup-' + this.id).setAttribute('paid', '')
        }
    }

    static effects = [
        /* Upg 1 */ () => {g.ipowp = O(1)},
        // function (thisArg) {...}
    ]

}