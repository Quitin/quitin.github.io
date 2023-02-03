function data(obj, prop, assign, on) {

    /**
     * obj: Get data from obj to assign (required)
     * prop: List of selected properties to be assigned (null = all)
     * assign: Assign data to this object (default = empty object)
     * on: Are all of the values OmegaNum? (default = false)
     */

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

function save(local, savefile = 'MillionsIncrementalSave') {
    // use local (boolean) parameter if you have textarea exporting/importing

    const l = {
        parent: ['lvl','mp','multiplier','pts','spd','upgScaling','lastTick','startpts','maxpts','ipow','ipowp','ip','ipup'],
        up: ['mul','cost'],
        mpup: ['cost','paid'],
        ipup: ['cost','paid'],
    }
    let o = data(g, l.parent)
    o.up = g.up.map(v => data(v, l.up))
    o.mpup = g.mpup.map(v => data(v, l.mpup))
    o.ipup = g.ipup.map(v => data(v, l.ipup))

    const out = btoa(JSON.stringify(o));
    localStorage.setItem(savefile, out)
    
    if (!local) {document.getElementById('loadinput').value = out}

}

function load(local, savefile = 'MillionsIncrementalSave') {

    const c = (local)?localStorage.getItem(savefile):document.getElementById('loadinput').value
    if (!c) return true

    let i
    try {i = JSON.parse(atob(c))}
    catch (e) {
        alert('Error: Could not decode save data. It might be invalid.\n' + e)
        return false
    } try {

        const saved = new Game // make new object just in case loading fails

        data(i, ['upgScaling','lastTick'], saved, false) // import non-class
        data(i, ['lvl','mp','multiplier','pts','spd','startpts','maxpts','ipow','ipowp','ip','ipup'], saved, true) // import class
    
        saved.up = i.up.map(v => data(v, null, new Upgrade, true))
        saved.mpup = i.mpup.map((v,i) => {
            v = data(v, ['cost','paid'], new MillionUpgrade, true)
            data(g.mpup[i], ['desc', 'predicate'], v)
            v.id = i
            return v
        })
        saved.ipup = i.ipup.map((v,i) => {
            v = data(v, ['cost','paid'], new IllionUpgrade, true)
            data(g.ipup[i], ['desc', 'predicate'], v)
            v.id = i
            return v
        })

        g = game = saved

        g.mpup.forEach(v => {
            if (v.paid) $('mpup-' + v.id).setAttribute('paid', '')
            else $('mpup-' + v.id).removeAttribute('paid')
        })
        g.ipup.forEach(v => {
            if (v.paid) $('ipup-' + v.id).setAttribute('paid', '')
            else $('ipup-' + v.id).removeAttribute('paid')
        })

        return true

    } catch (e) {
        alert('Error: Invalid or missing data in save code.\n' + e)
        throw e
    }
}

load(true)
setInterval(save(local = true), 1e4)