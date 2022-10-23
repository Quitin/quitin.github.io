const O = OmegaNum
const $ = i => document.getElementById(i)

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
            $('mpup'+(this.id+1)).style = 'background-color:cyan;color:black'
            console.log(this)
        }
    }

}

let game = new Game
const g = game


function lvlup() {
    g.pts = O(1)
    g.lvl = g.lvl.add(1);
    g.mp = g.mp.add(1);
    g.spd = O.pow(2,O(g.lvl).sub(1).neg());
    g.resetUpgs()
}

const HSLToRGB = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
};

function openTab(evt, group='tabcontent') {
  
    let i, tabcontent
    tabcontent = document.getElementsByClassName(group);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    $(evt).style.display = 'block';

};

function hsvcsv(arr) {return `rgb(${arr})`};

function tick() {

    const delay = (Date.now() - g.lastTick) / 1e3
    g.pts = g.pts.add(O.mul(g.spd, delay)).min(1e6)
    DOMUpdate()
    g.lastTick = Date.now()

}
function DOMUpdate() {

    const color = hsvcsv(HSLToRGB(O.mod(O.mul(O.log10(g.pts),60),360),100,50));
    $("number").innerHTML = g.pts.floor();
    $("number").style.color = color;
    g.up.forEach((v,i) => 
        $('up-cost-' + i).innerHTML = v.cost
    )
    $('mp').innerHTML = g.mp;
    $('lvl').innerHTML = g.lvl;

    $('upgradestab').style.display = g.lvl.lt(2) ? 'none' : 'inline'
    $('levelupbutton').style.display = g.pts.lt(1e6) ? 'none' : 'inline'

}

setInterval(tick, 17)