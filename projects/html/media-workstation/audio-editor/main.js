$ = (x) => {return document.getElementById(x+"")};

var auto = true, srcarr = [[],[]], effects = [], seindex = 0, efscc, selectedelement
let autorender
l = localStorage

function loadAud(src) {
    source = src || 'sounds/oof.mp3'
    source.audioToArray().then(v => {srcaud = v})
    $('in-c').innerHTML = ''
    let a = document.createElement('audio')
    a.setAttribute('controls','')
    a.setAttribute('style','display:inline-block')
    a.innerHTML = `<source src="${source}">`
    $('in-c').appendChild(a)
}

function render(takefromEffects,srcarr0,...efs) {
    let srcarr = Array.from(srcarr0 || srcaud)
    if (takefromEffects) {
        efs = effects.map((v)=>{return v.effect})
    };
    if (srcarr[0] instanceof Float32Array || srcarr[1] instanceof Float32Array) {
        srcarr[0] = Array.from(srcarr[0]);
        srcarr[1] = Array.from(srcarr[1])
    }
    let sampleAmount = $("length").value * $("sr").value;
    let sl = new Array(max(srcarr[0].length,sampleAmount - srcarr[0].length));
    sl.fill(0);
    let sr = [...sl];
    srcarr[0] = srcarr[0].concat(sl).splice(0,sampleAmount);
    srcarr[1] = srcarr[1].concat(sr).splice(0,sampleAmount);

    let ii=0;
    efs.forEach((efsindex)=>{
        if (effects[ii].bypass == false) {
        let input = efsindex
        let f = new Function('t','sr','v',input);
        let nd = [[],[]]
            for (let i=0;i<srcarr[0].length;i++) {
                let c = [srcarr[0][i],srcarr[1][i]]
                let sr = $('sr').value
                getSample = (t) => {
                    let s=srcarr
                    t %= s[0].length
                    return [s[0][floor(t)],s[1][floor(t)]]||0;
                }
                c = f(i,sr,c)
                if (typeof c == 'number') {
                    c = [c,c]
                }
                nd[0][i] = c[0]
                nd[1][i] = c[1]
            }
            for (let i=0;i<srcarr[0].length;i++) {
                srcarr[0][i] = nd[0][i]
                srcarr[1][i] = nd[1][i]
            }
        }
        ii++
    })
    $('out-c').innerHTML = ''
    let a = document.createElement('audio')
    a.setAttribute('controls','')
    a.setAttribute('style','display:inline-block')
    a.innerHTML = `<source src="${srcarr.toAudio($("sr").value).src}">`
    a.volume = 0.5
    $('out-c').appendChild(a)
    return srcarr
}

loadAud()

class Effect {
    constructor(name, effect, bypass) {
        this.name = name || 'Untitled';
        this.effect = effect || 'return v';
        this.bypass = bypass || false;
    }
}

function loadAllEffects() {
    $('effectsc').innerHTML = '';
    effects.forEach((v)=>{
        newEffect(v.name,v.effect,false,false,true)
    })
}

function displayAllEffects() {
    let i = 0;
    $('effectsc').innerHTML = '';
    effects.forEach((v)=>{
        newEffect(v.name,v.effect,v.bypass,false,false);
        if (v.bypass) {
            $('effectsc').children[i].classList.add('bypass')
        };
        i++
    })
}

newEffect('Untitled','return v',false,true,true); // Title, Code, Bypass, Select, Create Effect Object in effects Array
newEffect('Limiter','return [clamp(-1,v[0],1)/2,clamp(-1,v[1],1)/2]',false,false,true);
selectEffect(0)

$('input').oninput = () => {
    effects[seindex].effect = $('input').value
}

function selectClickedEffect(event) {
    let i = 0;
    efscc = Array.from($('effectsc').children);
    selectedelement = event.srcElement.parentElement;
    efscc.forEach((v)=>{
        v.classList.remove('class','select');
        v.setAttribute('style',`background-color:hsla(${i*30},100%,10%);border: 0.4vh solid hsla(${i*30},100%,50%)`);
        v.children[0].setAttribute('style',`color:hsla(${i*30},100%,80%)`)
        i++
    });
    event.srcElement.parentElement.classList.add('select');
    event.srcElement.parentElement.setAttribute('style','');
    event.srcElement.setAttribute('style','');
    seindex = efscc.indexOf(selectedelement);
    $('input').value = effects[seindex].effect
}

function selectEffect(index) {
    let i = 0;
    efscc = Array.from($('effectsc').children);
    selectedelement = $('effectsc').children[index];
    efscc.forEach((v)=>{
        v.classList.remove('class','select');
        v.setAttribute('style',`background-color:hsla(${i*30},100%,10%);border: 0.4vh solid hsla(${i*30},100%,50%)`);
        v.children[0].setAttribute('style',`color:hsla(${i*30},100%,80%)`);
        i++
    });
    selectedelement.classList.add('select');
    selectedelement.setAttribute('style','');
    selectedelement.children[0].setAttribute('style','');
    seindex = efscc.indexOf(selectedelement);
    $('input').value = effects[seindex].effect
}

[
    'sin','cos','tan',
    'sinh','cosh','tanh',
    'asin','acos','atan',
    'asinh','acosh','atanh',
    'abs','max','min','sign',
    'floor','round','ceil','trunc',
    'pow','log10','log2','exp'
].forEach((i)=>{
    Function(i+' = (...x) => {return Math.'+i+'(...x)}')();
})

log = (x,y) => {return log10(x)/log10(y)}
ln = (x) => {return Math.log(x)}
pi = acos(-1)
e = exp(1)
clamp = (x,y,z) => {return max(x,min(z,y))}

function renameeffect() {
    let newname = prompt('Set the new name to...',effects[seindex].name);
    if (!!newname) {
        $('effectsc').children[seindex].children[0].innerHTML = newname;
        effects[seindex].name = newname;
    }
}

function cloneeffect() {
    let s = effects[seindex];
    let neweff = new Effect(s.name,s.effect,s.bypass);
    effects.splice(seindex+1,0,neweff);
    displayAllEffects();
    selectEffect(seindex+1)
}

function bypasseffect() {
    effects[seindex].bypass = !(effects[seindex].bypass)
    displayAllEffects();
    selectEffect(seindex)
}

function deleteeffect() {
    $('effectsc').children[seindex].remove();
    effects.splice(seindex,1);
    displayAllEffects();
    selectEffect(max(seindex-1,0))
};

function addeffect() {
    newEffect('Untitled','return v',false,true,true);
    displayAllEffects();
    selectEffect(effects.length-1)
}

function moveLeft() {
    if (seindex > 0) {
    a = effects[seindex];
    b = effects[seindex-1];
    effects[seindex-1] = a;
    effects[seindex] = b;
    displayAllEffects();
    selectEffect(seindex-1);
    }
}

function moveRight() {
    if (seindex < effects.length - 1) {
    a = effects[seindex];
    b = effects[seindex+1];
    effects[seindex+1] = a;
    effects[seindex] = b;
    displayAllEffects();
    selectEffect(seindex+1);
    }
}

function bypass() {
    let k = effects[seindex].bypass;
    k = !k;
    displayAllEffects();
    selectEffect(seindex);
}

function newEffect(...x) {
    if (x[4]) {
        effects.push(new Effect(...x)) 
    };
    let element = document.createElement('div');
    element.innerHTML = `<p class='small' onclick='selectClickedEffect(event)'>${x[0]}</p>`;
    element.setAttribute('class','effect');
    $('effectsc').appendChild(element)
    if (x[3]) {
        element.classList.add('select');
        selectedelement = element
    };
}

function switchPage(x) {
    let pages = document.querySelectorAll('[id^=page-]');
    for (let i=0;i<pages.length;i++) {
        if (i == x) {
            pages[i].hidden = false;
            $('tabs').children[i].classList.add('select'); 
        } else {
            pages[i].hidden = true;
            $('tabs').children[i].classList.remove('select');       
        }
    };

}

$('upload').addEventListener('change', function () {
    let sf = $('upload').files[0];
    if (sf) {
        let b = URL.createObjectURL(sf);
        loadAud(b)
    }
});

function writeFile(content,name) {
    const filename = name+'.txt';
  
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  
    window.URL.revokeObjectURL(url);
}

$('upload-project').addEventListener('change', handleFile)

function handleFile() {
    const fileInput = $('upload-project');
    const file = fileInput.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const contents = event.target.result;
        parsedcontents = contents;
        try {JSON.parse(parsedcontents)+0} catch {parsedcontents = 'Error'};
        if (parsedcontents != 'Error') {
        parsedcontents = JSON.parse(contents)
        };
        let p1 = parsedcontents
        globaltestp = [p1]
        console.log(parsedcontents)
        if (typeof p1 == 'object') {
            effects = p1;
            displayAllEffects()
            selectEffect(0)
        } else {
            console.log('This file is not a valid preset file.');
        }
      };
      reader.readAsText(file);
    } else {
      console.log('No file selected.');
    }
  }

function saveProject() {
    let efs = JSON.stringify(effects)
    let cn = efs
    globalCn = cn
    writeFile(cn,$('project-name').value)
}

function newProject() {
    effects = [];
    srcarr = [[],[]];
    loadAud('sounds/oof.mp3');
    newEffect('Untitled','return v',false,true,true); // Title, Code, Bypass, Select, Create Effect Object in effects Array
    newEffect('Limiter','return [clamp(-1,v[0],1)/2,clamp(-1,v[1],1)/2]',false,false,true);
    displayAllEffects()
    selectEffect(0)
}

function saveSession() {
    l.setItem('effects', JSON.stringify(effects))
}

function loadSession() {
    effects = JSON.parse(l.getItem('effects'))
    displayAllEffects()
    selectEffect(0)
}

setInterval(saveSession,10e3)

setTimeout(loadSession,1e2)

switchPage(1)