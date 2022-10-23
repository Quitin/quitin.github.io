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

function save(savefile = 'MillionsIncrementalSave') {
    localStorage.setItem(savefile, btoa(encodeURIComponent(JSON.stringify(game))));
}

function load(savefile = 'MillionsIncrementalSave') {
    game = new Game();
    /** @type {Game} */

    const savedGame = JSON.parse(decodeURIComponent(atob(localStorage.getItem(savefile))));
    
    for (const stat in savedGame) {
        game[stat] = savedGame[stat];
    }

    // the save has been reconstructed but the omeganums are broken, fix them here

    // 1. flatten the object
    function flatten(data, c) {
        var result = {};
        for (var i in data) {
            if (typeof data[i] == 'object' && !data[i].array) Object.assign(result, flatten(data[i], c + '.' + i));
            else result[(c + '.' + i).replace(/^\./, "")] = data[i];
        }
        return result;
    }
    game = flatten(game, '');

    // 2. replace everything that should be an omeganum with an omeganum
    for (const value in game) {
        if (game[value].array) game[value] = new OmegaNum(game[value])
    }
    
    // 3. unflatten the object
    function unflatten(data) {
        var result = {}
        for (var i in data) {
            var keys = i.split('.')
            keys.reduce(function(r, e, j) {
                return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : [])
            }, result)
        }
        return result;
    }
    game = unflatten(game);
    
    // omeganums are back!! yay :D
}

console.log('its working')