$ = (x) => {return document.getElementById(x+"")};

c = $('display');
ctx = $('display').getContext('2d', {willReadFrequently: true});
var auto = true;
var effects = [];
var seindex = 0;
var efscc, selectedelement

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

function loadImg() { // this initializes the source image and the image for the variable v
        imgd = ctx.getImageData(0,0,c.width,c.height)
        img = new Image(256,256)
        // img.src = '../image-editor/images/disguised face.png' <- uncomment this for the disguised face haha lol Functinos.
        img.onload = function() {
            ctx.clearRect(0,0,c.width,c.height);
            ctx.drawImage(img,0,0,img.width,img.height,0,0,c.width,c.height);
            imgd = ctx.getImageData(0,0,c.width,c.height);
            source = ctx.getImageData(0,0,c.width,c.height);
            c.width = imgd.width;
            c.height = imgd.height;
        };
        image = imgd;
        width = image.width;
        height = image.height;

}

function newCanvas(w,h) { // creates an empty canvas of any size
    imgd = ctx.getImageData(0,0,c.width,c.height)
    img = new Image(w,h);
    img.src = '';
    // img.src = '../image-editor/images/disguised face.png' <- uncomment this for the disguised face haha lol Functinos.
        ctx.clearRect(0,0,c.width,c.height);
        ctx.drawImage(img,0,0,img.width,img.height,0,0,c.width,c.height);
        imgd = ctx.getImageData(0,0,c.width,c.height);
        source = ctx.getImageData(0,0,c.width,c.height);
    image = imgd;
    width = image.width;
    height = image.height;
    c.width = w;
    c.height = h;
    console.log([c.width,width])
}

function updateCSS() { // this function asserts that all of the image can be seen | C = Container, D = Display (or canvas)
    CWidth = $('right-half').getBoundingClientRect().width;
    CHeight = $('right-half').getBoundingClientRect().height;
    DWidth = $('display').getBoundingClientRect().width;
    DHeight = $('display').getBoundingClientRect().height;
    $('right-half').style.justifyContent = DWidth > CWidth ? 'flex-start' : 'center';
    $('right-half').style.alignItems = DHeight > CHeight ? 'flex-start' : 'center';
}

window.onresize = updateCSS

loadImg()
setInterval(()=>{try{auto?render(true):0}catch{}},10) // Execute scripts automatically (by default) if auto is true.

function getPixel(x,y) { // gets the rgba data of the specified pixel from the source (or the image the code is currently applying effects to)
    let i = (Math.floor(x) - width*Math.floor(x/width)) + (Math.floor(y) - width*Math.floor(y/width)) * width
    return image.data.slice(i*4,i*4+4);
}

function renameeffect() {
    let newname = prompt('Set the new name to...');
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

function legacyrender() {
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(img,0,0,img.width,img.height,0,0,c.width,c.height);
    image = ctx.getImageData(0,0,c.width,c.height);
        input = $('input').value;
        t = Date.now();
        f = new Function('x', 'y', 'i', 't', 'v', input);
        let width = c.width;
        let height = c.height;
        let nd = [];
        for (let i=0;i<width*height;i++){
            let x = i % width;
            let y = ~~(i / width);
            let c = [image.data[i*4],image.data[i*4+1],image.data[i*4+2],image.data[i*4+3]];
            c = f(x,y,i,t,c);
            if (typeof c == 'number') {
                c = [(c>>16)&255,(c>>8)&255,c&255,255]
            }
            nd[i*4+0] = c[0] // push the output to a new array
            nd[i*4+1] = c[1]
            nd[i*4+2] = c[2]
            nd[i*4+3] = c[3]
        };

        for (let k=0;k<nd.length;k++) {
            image.data[k] = nd[k]
        };
    ctx.putImageData(image, 0, 0);
};

function render(takefromEffects,...efs) {
    if (takefromEffects) {
        efs = effects.map((v)=>{return v.effect})
    };
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(img,0,0,img.width,img.height,0,0,c.width,c.height);
    image = ctx.getImageData(0,0,c.width,c.height);
    efs = Array.isArray(efs[0])?efs[0]:efs;
    let ii = 0;
    efs.forEach((efsindex)=>{
        if (!effects[ii].bypass) {
            input = efsindex; //$('input').value;
            t = Date.now();
            f = new Function('x', 'y', 'i', 't', 'v', input);
            let width = c.width;
            let height = c.height;
            let nd = [];
            for (let i=0;i<width*height;i++){
                let x = i % width;
                let y = ~~(i / width);
                let c = [image.data[i*4],image.data[i*4+1],image.data[i*4+2],image.data[i*4+3]];
                c = f(x,y,i,t,c);
                if (typeof c == 'number') {
                    c = [(c>>16)&255,(c>>8)&255,c&255,255]
                }
                nd[i*4+0] = c[0] // push the output to a new array
                nd[i*4+1] = c[1]
                nd[i*4+2] = c[2]
                nd[i*4+3] = c[3]
            };

            for (let k=0;k<nd.length;k++) {
                image.data[k] = nd[k]
            };
        };

        ii++
    })
    ctx.putImageData(image, 0, 0);
};

$('s-auto').oninput = () => {auto = $('s-auto').checked}

function newEffect(...x) {
    if (x[4]) {
        effects.push(new Effect(...x)) 
    };
    let count = $('effectsc').childElementCount;
    let element = document.createElement('div');
    element.innerHTML = `<p class='small' onclick='selectClickedEffect(event)'>${x[0]}</p>`;
    element.setAttribute('class','effect');
    $('effectsc').appendChild(element)
    if (x[3]) {
        element.classList.add('select');
        selectedelement = element
    };
}

$('upload').oninput = function() {
    file = $('upload').files[0];
    console.log('Did it go well? Hmmm...');
    if (file) {
        reader = new FileReader();
            reader.onload = function(event) {  
                img = new Image();      
                img.src = event.target.result;
                img.onload = function() {
                    c.width = img.width;
                    c.height = img.height;
                    ctx.clearRect(0,0,c.width,c.height);
                    ctx.drawImage(img,0,0);
                    imgd = ctx.getImageData(0,0,c.width,c.height);
                    source = ctx.getImageData(0,0,c.width,c.height);
                    image = imgd;
                    width = image.width;
                    height = image.height;
                    updateCSS();
                }
            };
        reader.readAsDataURL(file);
    }
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

switchPage(0)