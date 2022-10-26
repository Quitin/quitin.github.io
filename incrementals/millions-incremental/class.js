'use strict'
class Game {

    startpts = O(1)
    pts = O(1)
    lvl = O(1)
    mp = O(0)
    upgScaling = O(10)
    multiplier = O(2)
    up = []
    spd = O(1)
    mpup = [
        // you can space arguments like this if you want, it's easier to read
        new MillionUpgrade('Reduce scaling by 4',                   1, true),
        new MillionUpgrade("Multiply each doubler's effect by 1.5", 1, true),
        new MillionUpgrade('Points reset to 1000 instead of 1',     1, () => g.mpup[0].paid && g.mpup[1].paid)
    ]

    lastTick = Date.now()

    constructor() {this.resetUpgs()}

    resetUpgs() {
        this.up = []
        for (let i = 0; i < 4; i++)
            this.up.push(new Upgrade(10 ** (i + 1)))
        this.mpup = this.mpup.map((v, i) => (v.id = i, v))
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

    constructor(startCost = 10) {
        this.mul = O(1),
        this.cost = O(startCost)
    }

    buy() {
        if (g.pts.gte(this.cost)) {
            this.mul = this.mul.mul(g.multiplier)
            g.pts = g.pts.sub(this.cost)
            this.cost = this.cost.mul(g.upgScaling)
            g.updateSpd()
        }
    }

}

class MillionUpgrade {

    paid = false

    constructor(desc, cost, predicate=()=>true, id) {
        this.desc = desc // Description of the upgrade that you see in-game.
        this.cost = O(cost) // Cost of the upgrade.
        this.id = id
        this.predicate = predicate === true ? () => true : predicate // Function that returns true if buyable/unlocked
        }

    buy() {
        if (g.mp.gte(this.cost) & !this.paid & this.predicate() == 1) {
            console.log(this)
            g.mp = g.mp.sub(this.cost)
            this.paid = true
            MillionUpgrade.effects[this.id]() // The "this" is the MillionUpgrade object. Just in case the object should be used
            $('mpup-' + this.id).setAttribute('paid', '')
        }
    }

    
    static effects = [
        /* Upg 1 */ () => {g.upgScaling = O(g.upgScaling).sub(4)},
        /* Upg 2 */ () => {g.multiplier = O(g.multiplier).mul(1.5)},
        /* Upg 3 */ () => {g.startpts = O(1e3)}
        // function (thisArg) {...}
    ]

}