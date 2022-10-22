function data(obj, prop, assign, on) {

    if (!obj) return
    let o = assign ?? {}
    prop ??= Object.keys(obj)
    prop.forEach(v => {
        try{
            o[v] = on ? O(obj[v]) : (obj[v].constructor == O ? obj[v].toString() : obj[v])
        }catch{}
    })
    return o

}

function save() {

    const l = {
        parent: ['lvl','mp','multiplier','pts','spd','upgScaling'],
        up: ['mul','cost'],
        mpup: ['cost','paid']
    }
    let o = data(g, l.parent)
    o.up = g.up.map(v => data(v, l.up))
    o.mpup = g.mpup.map(v => data(v, l.mpup))

    const out = btoa(JSON.stringify(o));
    localStorage.setItem("MillionsIncrementalSave",data)
    
};

function load() {

    const o = JSON.parse(atob(localStorage.getItem('MillionsIncrementalSave')))

    

};
    
console.log('its working')