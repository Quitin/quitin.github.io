$ = (x) => {return document.getElementById(x+"")};

c = $('display');
ctx = $('display').getContext('2d', {willReadFrequently: true});
var auto = true, effects = [], seindex = 0, efscc, selectedelement, V = 1, g = !1, vd = g
let autorender
l = localStorage

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

function newCanvas(w,h,src) { // creates an empty canvas of any size
    c.width = 256;
    c.height = 256;
    imgd = ctx.getImageData(0,0,c.width,c.height)
    img = new Image(w,h);
    img.src = src || '';
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
setAR()

$('s-auto').oninput = setAR

function setAR() {
    clearInterval(autorender)
    autorender = setInterval(()=>{try{auto?render(true):0}catch{}},g?500:10) // Execute scripts automatically (by default) if auto is true.
}

function getPixel(x,y) { // gets the rgba data of the specified pixel from the source (or the image the code is currently applying effects to)
    let i = (Math.floor(x) - width*Math.floor(x/width)) + (Math.floor(y) - width*Math.floor(y/width)) * width
    return image.data.slice(i*4,i*4+4);
}

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
    if (g) {
        const frames = $('frames').value
        var progress = round((V+1) / frames * 1e4) / 100
        gifenc.addFrame(ctx, false); V++
        $('infobox').innerHTML = '<p>' + `Rendering ${V} / ${frames} frames (${progress} %)` + '<button style="display:inline" onclick=stopexport()>Cancel</button>' + '</p>'
    };
    if (vd) {
        gifenc.addFrame(ctx, false); V++
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

function saveImage() { // saves canvas image to local machine
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'Image_Editor_Saved_Image.png');
    $('display').toBlob(function(blob) {
        let url = URL.createObjectURL(blob);
        downloadLink.setAttribute('href', url);
        downloadLink.click();
    });
    $('infobox').innerHTML = '<p class="white">Saved image! The image is downloading to your local machine, please wait.</p>'
    if (typeof fade !== 'undefined' && typeof fade !== 'undefined') {clearTimeout(fade); clearTimeout(fade2)}
    fade = setTimeout(()=>{
        $('infobox').children[0].style.opacity = '0%'
        fade2 = setTimeout(()=>{
            $('infobox').innerHTML = ''
        },500)
    },5e3)
}

function copyImage() { // copies canvas image to clipboard
    $('display').toBlob(function(blob) { 
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]); 
    });
    $('infobox').innerHTML = '<p class="green">Copied to clipboard!</p>'
    if (typeof fade !== 'undefined' && typeof fade !== 'undefined') {clearTimeout(fade); clearTimeout(fade2)}
    fade = setTimeout(()=>{
        $('infobox').children[0].style.opacity = '0%'
        fade2 = setTimeout(()=>{
            $('infobox').innerHTML = ''
        },500)
    },3e3)
}

setInterval(() => {
    $('export').style.color = `hsl(${(Date.now())/20},100%,60%)`
    $('export').style.backgroundColor = `hsl(${(Date.now())/20},50%,5%)`
},30)

switchPage(1)

function exportgif() {
    g = !0
    setAR()
    gifenc = new GIFEncoder()
    gifenc.setSize(c.width,c.height)
    gifenc.setDelay(1e3 / ($('fps').value * 1 || 30))
    gifenc.setQuality($('quality').value || 32)
    gifenc.setRepeat(0)
    auto = true
    gifenc.start()
    rendering = setInterval(()=>{
        if (V >= (($('frames').value * 1) || 100)) {
            gifenc.finish()
            g = !1, V = 1, auto = false
            vg = gifenc;
            gifenc.download($('gifname').value || 'Untitled')
            clearInterval(rendering)
            $('infobox').innerHTML = '<p class="green">Render complete!</p>'
        }
    },10)
}

function stopexport() {
    gifenc.finish()
    g = !1, V = 1, auto = false
    vg = gifenc;
    clearInterval(rendering)
    $('infobox').innerHTML = ''
}

// This is a scrapped (and unfinished) feature.
// I couldn't find a working library that can create videos.
// I've tried stuff such as FFmpeg.js, MediaRecorder, VideoContext.js...
// And none of them fitted my needs.

/* function exportvideo() {
    vd = !0
    videnc = new Whammy.Video(30,10)
    videnc.setSize(c.width,c.height)
    auto = true
    gifenc.start()
    let wait = setInterval(()=>{
        if (V >= 60) {
            videnc.compile()
            vd = !1, V = 1
            gifenc.download('Test')
            clearInterval(wait)
        }
    },10)
} */ 

function saveSession() {
    l.setItem('effects', JSON.stringify(effects))
    l.setItem('image',img.src+'')
    l.setItem('imgdims','['+[img.width,img.height]+']')
}

function loadSession() {
    let [w1,w2] = JSON.parse(l.getItem('imgdims'));
    let src2 = l.getItem('image')
    img.src = src2
    newCanvas(w1,w2,src2)
    effects = JSON.parse(l.getItem('effects'))
    displayAllEffects()
    selectEffect(0)
}

function updateInfo() {
    let r = (x) => {return round(x * 100) / 100}
    let Ts = $('frames').value / $('fps').value
    let Tmin = Ts / 60
    let Th = Tmin / 60
    var Length = ''

    Length = '= ' + r(Ts) + ' seconds';
    if (Tmin >= 1) {Length = '= ' + r(Tmin) + ' minutes'}
    if (Th >= 1) {Length = '= ' + r(Th) + ' hours'}
    $('calclength').innerHTML = Length
}

function fitImage(b3) {
    let a1 = $('right-half');
    let a2 = a1.style;
    if (b3) {  
        let a = a1.getBoundingClientRect()
        let b1 = a.width / c.width
        let b2 = a.height / c.height
        let d = min(b1,b2) * .75
        $('display').style.transform = `scale(${d})`
        a1.scrollTop = 0
        a1.scrollLeft = 0
        a2.overflow = 'hidden'
    } else {
        $('display').style.transform = ''
        a2.overflow = ''
    }
}

function tick() {
    updateInfo()
    updateCSS()
    fitImage($('s-fitimage').checked)
}

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
        debugger
        const contents = event.target.result;
        let contents1 = contents.split('#DELIMITER#')
        let parsedcontents = contents1[1], parsedeffects = contents1[0];
        try {JSON.parse(parsedcontents)+0} catch {parsedcontents = 'Error'};
        try {JSON.parse(parsedeffects)+0} catch {parsedeffects = 'Error'};
        if (parsedcontents != 'Error') {
        parsedeffects = JSON.parse(contents1[0])
        parsedcontents = JSON.parse(contents1[1])
        };
        let p1 = parsedcontents, p2 = parsedeffects;
        globaltestp = [p1, p2]
        console.log(parsedcontents)
        if (Array.isArray(p1) && typeof p2 == 'object' && p1.length == 3) {
            img.src = p1[2]
            newCanvas(p1[0], p1[1], p1[2])
            effects = p2
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
    let [i1,iw,ih] = [img.src, c.width, c.height];
    let efs = JSON.stringify(effects)
    let cn = efs+
        '\n#DELIMITER#\n'+
        '[\n'+
        '"'+iw+'",\n'+
        '"'+ih+'",\n'+
        '"'+i1+'"\n]';
    globalCn = cn
    writeFile(cn,$('project-name').value)
}

setTimeout(loadSession,1e2)

newCanvas(width,height)

setInterval(saveSession,10e3)

setInterval(tick,50/3)