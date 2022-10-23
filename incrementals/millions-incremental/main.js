const O = OmegaNum
const $ = i => document.getElementById(i)

let game = new Game
let g = game


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