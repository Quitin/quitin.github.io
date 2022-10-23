'use strict'
class Game {

    pts = O(1)
    lvl = O(1)
    mp = O(0)
    upgScaling = 10
    multiplier = O(2)
    up = []
    spd = O(1)
    mpup = [
        new MillionUpgrade(1, () => g.upgScaling -= 4, 0),
        new MillionUpgrade(1, () => g.multiplier = g.multiplier.mul(1.5), 1)
    ]

    lastTick = Date.now()

    constructor() {this.resetUpgs()}
    resetUpgs() {
        this.up = []
        for (let i = 0; i < 4; i++)
            this.up.push(new Upgrade(10 ** (i + 1)))
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

    constructor(cost, onBuy, id) {
        this.cost = O(cost)
        this.onBuy = onBuy
        this.id = id
    }

    buy() {
        if (g.pts.gte(this.cost)) {
            g.mp = g.mp.sub(this.cost)
            this.paid = true
            this.onBuy(this)
            $('mpup-' + this.id).setAttribute('paid', '')
            console.log(this)
        }
    }

}