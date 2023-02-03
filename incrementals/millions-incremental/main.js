const O = OmegaNum
const $ = i => document.getElementById(i)
const $c = A => document.querySelector('.' + A)

let game = new Game;
let g = game;

function lvlup() {
    g.pts = g.startpts;
    g.maxpts = O(1)
    g.lvl = g.lvl.add(1).min(1e6);
    g.spd = O(1).div(O(2).pow((g.lvl.min(1000)).sub(1)))
    g.mp = g.mp.add(1).min(1e6);
    if (g.mpup[11].paid.eq(1)) {
    g.lvl = g.lvl.add(g.lvl.mul(0.001).floor()).min(1e6);
    g.mp =  g.mp.add(g.mp.mul(0.001).floor()).min(1e6)  ;
    };
    g.resetUpgs()
}

function illionize() {
    g.resetMilUpgs()
    lvlup();
    g.pts = O(1)
    g.maxpts = O(1)
    g.lvl = O(1)
    g.mp = O(0)
    g.ip = O(g.ip).add(1)
    g.upgScaling = O(10)
    g.multiplier = O(2)
    g.spd = O(1)
    if (g.ipup[0].paid.eq(1)) {g.ipowp = g.ipowp.mul(2)};
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
    g.maxpts = O.max(g.maxpts, g.pts)
    g.ipow = g.ipow.add(g.ipowp.mul(1/60))
    g.pts = g.pts.add(O.mul(g.spd.max('1e-10').div(O.pow(2,O(g.lvl.min(1000)).sub(1)))
    
    .mul(g.mpup[2].paid.eq(1) ? g.lvl.pow(g.mpup[3].paid.eq(1) ? 8:2):1)
    .mul(g.mpup[6].paid.eq(1) ? g.mp.max(1).pow(6) : 1)
    .mul(g.mpup[7].paid.eq(1) ? '1e9' : '1')
    .mul(g.mpup[8].paid.eq(1) ? '10'  : '1')
    .mul(g.mpup[9].paid.eq(1) ? O(g.lvl).tetr(1.557) : '1')
    .mul(g.mpup[10].paid.eq(1) ? O(g.mp).tetr(1.557) : '1')
    .mul(g.ipow.add(1))
    .div(g.maxpts.div(1e6).max(1).pow(4))
    , delay))

    
    

    .min(g.ipup[0].paid.eq(1) ? 'Infinity' : 1e6) // Cap


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
    $('ip').innerHTML = O(g.ip).floor();
    $('ipow').innerHTML = O(g.ipow).mul(1000).floor().div(1000);
    $('ipowp').innerHTML = O(g.ipowp).mul(1000).floor().div(1000);

    $('upgradestab').style.display = g.lvl.lt(2) ? 'none' : 'inline'
    $('levelupbutton').style.display = g.pts.lt(1e6) ? 'none' : 'inline'
    $("illionizetab").style.display = g.ip.lte(0) && g.ipup[0].paid ? 'none' : 'inline'
    $('illionizebutton').style.display = g.lvl.lt(1e6) ? 'none' : 'inline'

    for (let index = 0; index < g.mpup.length; index++) {
        $('mpupd-'+index).innerHTML = g.mpup[index].desc
        if ($('mpupcost-'+index) != null) {
        $('mpupcost-'+index).innerHTML = g.mpup[index].paid.eq(0)?g.mpup[index].cost.eq(0)?'Cost: Free':'Cost: '+g.mpup[index].cost+' MP':'Purchased!'
        //$c('classhlight').innerHTML = 'a'
        }
        if (g.mpup[index].paid.eq(1)) {
            $('mpup-'+[index]).setAttribute('paid', '')
        } else {
            $('mpup-'+[index]).removeAttribute('paid')
        }
    }

    for (let index = 0; index < g.ipup.length; index++) {
        $('ipupd-'+index).innerHTML = g.ipup[index].desc
        if ($('ipupcost-'+index) != null) {
        $('ipupcost-'+index).innerHTML = g.ipup[index].paid.eq(0)?g.ipup[index].cost.eq(0)?'Cost: Free':'Cost: '+g.ipup[index].cost+' IP':'Purchased!'
        //$c('classhlight').innerHTML = 'a'
        }
        if (g.ipup[index].paid.eq(1)) {
            $('ipup-'+[index]).setAttribute('paid', '')
        } else {
            $('ipup-'+[index]).removeAttribute('paid')
        }
    }

    if (g.mpup[5].paid.eq(1) && g.pts.gte(1e6)) {
        lvlup()
    }

    if (g.mpup[5].paid.eq(1)) {
    for (let index = 0; index < g.up.length; index++) {
        if (g.pts.gte(g.up[index].cost)) {
            g.up[index].buy()
        }
    }
    }

}

setInterval(tick, 17)

