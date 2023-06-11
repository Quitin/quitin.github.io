var c = document.getElementById('graph');
var ctx = c.getContext('2d')
const $ = (x) => {
    return document.getElementById(x)
};
c.width = c.getBoundingClientRect().width;
c.height = c.getBoundingClientRect().height;
let mnx = -10;
let mxx = 10;
let mny = -10/c.width*c.height;
let mxy = 10/c.width*c.height;
precision = 10;
ctx.font = "21px MonospaceTypeWriter";
ctx.fillStyle = "blue";
ctx.textAlign = "center";

imgd = ctx.getImageData(0,0,c.width,c.height)

trobj = imgd.data.buffer;

setTimeout(() => {
    if (c.width < 400) {
        ctx.fillText("Welcome to", c.width / 2, c.height / 2 - 15);
        ctx.fillText("Mathjs Grapher", c.width / 2, c.height / 2 + 15)
    } else {
        ctx.fillText("Welcome to Mathjs Grapher", c.width / 2, c.height / 2);
    };
    ctx.lineWidth = 1;
}, 100);

let w = new Worker('./worker.js');
// Mathjs Grapher uses web workers to optimize performance
// of the grapher by executing background processes.

w.addEventListener('message', (event) => {
    const data = event.data;
    console.log(data);

    if (Array.isArray(data)) {fArray = new Array();

    fArray['log'] = ()=>{delete data.msg;console.log(data.length==1?data[0]:data)}

    fArray['draw text'] = ()=>{
    delete data.msg;console.log(data);
    c.width = Math.min($('graphcontainer').clientWidth,window.innerWidth*.55);
    c.height = $('graphcontainer').clientHeight;
    ctx.putImageData(data[0],0,0)};

    (fArray[data['msg']])()

    };
    
  });

var hold = false;

w.m = function(x) {
    w.postMessage(x)
}
w.m(['set precision', precision])
w.m(['Give me the SCRIPTS']);

function Outputs(Expression) {

let arre=[];
let arim=[];
let arv=[];
let xpos = (a) => {
return (1 - a / c.width) * mnx + (a / c.width) * mxx
};
for (i=0;i<=c.width;i+=(mxx-mnx)/c.width*precision) {
arv.push(xpos(i));

arre[xpos(i)] = f('re('+Expression+')',i);
arim[xpos(i)] = f('im('+Expression+')',i)
};
console.log(['Real Part: ',arre]);
console.log(['Imaginary Part: ',arim])}

function GRAPH(mnx,mxx,mny,mxy) {
    c.width = c.getBoundingClientRect().width;
    c.height = c.getBoundingClientRect().height;
    imgd = ctx.getImageData(0,0,c.width,c.height)
    w.m('set xy range',mnx,mxx,mny,mxy);
    w.m('set c dim',c.width,c.height);
    w.m(['draw text',imgd]);
}

function graphdrag1(e) { // Down
    setvalues = true
    mx1 = e.clientX;
    my1 = e.clientY;
    hold = true;
};

function graphdrag2(e) { // Move

    mx2 = e.clientX;
    my2 = e.clientY;
    if (hold) {


        let dx = (mx1 - mx2) * (mxx - mnx) / c.width;
        let dy = (my1 - my2) * (mxy - mny) / c.height;
        drawgrid(mnx + dx, mxx + dx, mny + dy, mxy + dy)
    };
};

function graphdrag3(e) // Up
{
    if (hold) {
        let dx = (mx1 - mx2) * (mxx - mnx) / c.width;
        let dy = (my1 - my2) * (mxy - mny) / c.height
        mnx += dx
        mxx += dx
        mny += dy
        mxy += dy
    }
    w.m(['graphAlpha', imgd, mnx, mxx, mny, mxy, input]);
    hold = false;
    setvalues = true;
    console.log('Release')
};

var scrolling = false;

function onscrol(e) {
    scrolling = true;
    let posX = Math.floor(e.clientX - $('graph').getBoundingClientRect().x) / c.width;
    let posY = Math.floor(e.clientY - $('graph').getBoundingClientRect().y) / c.height;
    posX = mnx * (1 - posX) + mxx * posX;
    posY = mny * (1 - posY) + mxy * posY;

    let zoom = .8;

    if (e.deltaY < 0) { // Zoom in function

        mnx = (mnx + posX * (1 / zoom - 1)) * zoom;
        mxx = (mxx + posX * (1 / zoom - 1)) * zoom;
        mny = (mny + posY * (1 / zoom - 1)) * zoom;
        mxy = (mxy + posY * (1 / zoom - 1)) * zoom;

    } else { // Zoom out function

        mnx = mnx / zoom - posX * (1 / zoom - 1);
        mxx = mxx / zoom - posX * (1 / zoom - 1);
        mny = mny / zoom - posY * (1 / zoom - 1);
        mxy = mxy / zoom - posY * (1 / zoom - 1);

    }

    drawgrid(mnx, mxx, mny, mxy);
    scrolling = true
}

setInterval(()=>{
    if (scrolling) {
        scrolling = false;
        graph(mnx, mxx, mny, mxy)
    }
},100)

function fixnum(n) {

    a = (Math.abs(n) >= 1e6 || Math.abs(n) < 1e-3 && n != 0) ?

        Math.round(1e3 * (n / (10 ** Math.floor(Math.log10(Math.abs(n) + (1 - Math.sign(n) ** 2)))) + 1e-6 * Math.sign(n))) / 1e3

        +
        '\u00d710^' +

        Math.floor(Math.log10(Math.abs(n))) :
        Math.floor(n * 1e3 + 1e-7) / 1e3;

    return a
}

function f(x, y) {
    return math.evaluate((x).replace(/x/g, '(' + y + ')'))
};

function calcinput() {
    let normaloutput = math.evaluate($('input').value);
    let result;
    result = normaloutput??""
    if (["number","Complex"].includes(math.typeOf(normaloutput))) {
    try {
    let re = math.evaluate("re("+$('input').value+")");
    let im = math.evaluate("im("+$('input').value+")");
    let re1 = Math.round(re*1e6)/1e6;
    let im1 = Math.round(im*1e6)/1e6;
    let markup = (x,color) => {return `<span style='color:${color}'>`+x+`</span>`}
    re = re1==0||Math.abs(re)>=1e10?re.toExponential(6):re1;
    im = im1==0||Math.abs(im)>=1e10?im.toExponential(6):im1;
    re = re==0?0:re;
    im = im==0?0:im;
    re = (Math.abs(re)<=1e-7||Math.abs(re)>=1e10)&&re!=0?(re*1).toExponential()+"":re;
    im = (Math.abs(im)<=1e-7||Math.abs(im)>=1e10)&&im!=0?(im*1).toExponential()+"":im;
    result = ""+re;
    result = markup(result,"blue") + "" + ((im!=0)?(im>0?(" + "+(im!=1?(markup(im,"red")):"")+markup("i","red")):(" - "+(im!=-1?((Math.abs(im)<=1e-6||Math.abs(im)>=1e10?markup((-im).toExponential(),"red"):markup(-im,"red"))):"")+markup("i","red"))):"");
    result = re==0?(markup(im + "i","red")):result;
    result = re==0?(Math.abs(im)==1?(im>0?markup("i","red"):markup("-i","red")):result):result;
    result = (result=='0i')?'0':result;
    result = im==0?(re):result;
    }
    catch {result = ''}}

    if (math.typeOf(normaloutput) == undefined) {}
    if (math.typeOf(normaloutput) == "function")
    {result = 'Function'}



    $('calcresult').innerHTML = result
}

drawgrid = (minX, maxX, minY, maxY) => {

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.width, c.height);

    let aspect = c.width / c.height;
    let autozoomFactor = 4;
    let gridStepX = 10 ** (Math.floor(Math.log10((maxX - minX) / autozoomFactor)));

    for (let i = gridStepX * Math.ceil(minX / gridStepX); i <= maxX; i += gridStepX) {
        ctx.beginPath();
        const xPos = ((i - minX) / (maxX - minX)) * c.width;
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, c.height);
        ctx.strokeStyle = '#BBBBBB';
        ctx.stroke();
    };

    let gridStepY = 10 ** (Math.floor(Math.log10((maxY - minY) / autozoomFactor * aspect)));

    for (let i = gridStepY * Math.ceil(minY / gridStepY); i <= maxY; i += gridStepY) {
        ctx.beginPath();
        const yPos = ((i - minY) / (maxY - minY)) * c.height;
        ctx.moveTo(0, yPos);
        ctx.lineTo(c.width, yPos);
        ctx.strokeStyle = '#BBBBBB';
        ctx.stroke();
    };

    // Axis Numbers
    let axisgridStepX = [2, 5, 10][Math.floor((Math.log10((maxX - minX) / 10) - Math.floor(Math.log10((maxX - minX) / 10))) * 3)] * 10 ** (Math.floor(Math.log10((maxX - minX) / 10)))

    for (let i = axisgridStepX * Math.ceil(minX / axisgridStepX); i <= maxX; i += axisgridStepX) {
        ctx.beginPath();
        const xPos = ((i - minX) / (maxX - minX)) * c.width;
        ctx.font = "16px MonospaceTypewriter";
        ctx.fillStyle = "black";
        if (Math.abs(xPos / i) <= 1e15) {
            ctx.fillText(fixnum(i), xPos, Math.min(Math.max(-2 + minY / (minY - maxY) * c.height, 15), c.height - 5))
        };
    };

    let axisgridStepY = [2, 5, 10][Math.floor((Math.log10((maxY - minY) / 10 * aspect) - Math.floor(Math.log10((maxY - minY) / 10 * aspect))) * 3)] * 10 ** (Math.floor(Math.log10((maxY - minY) / 10 * aspect)))

    for (let i = axisgridStepY * Math.ceil(minY / axisgridStepY); i <= maxY; i += axisgridStepY) {
        ctx.beginPath();
        const yPos = ((i - minY) / (maxY - minY)) * c.height;
        ctx.font = "16px MonospaceTypewriter";
        ctx.fillStyle = "black";
        if (Math.abs(yPos / i) <= 1e15) {
            ctx.fillText(fixnum(-i), Math.min(Math.max(minX / (minX - maxX) * c.width, 2), c.width - 12 - (Math.abs(i) >= 1e6 ? 15 : 0) - (i>0?10:0) - 10 * Math.min(6, Math.floor(Math.log10(Math.abs(i) + 1 - Math.sign(i) ** 2)))), yPos)
        };
    };

    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(0, minY / (minY - maxY) * c.height);
    ctx.lineTo(c.width, minY / (minY - maxY) * c.height);
    ctx.stroke();
    ctx.moveTo(minX / (minX - maxX) * c.width, 0);
    ctx.lineTo(minX / (minX - maxX) * c.width, c.height);
    ctx.stroke();
}

graph = (minX, maxX, minY, maxY) => {

    input = document.getElementById('input').value;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillRect(0, 0, c.width, c.height);

    drawgrid(minX, maxX, minY, maxY);

    ['re', 'im'].forEach((type) => {
        ctx.beginPath();
        for (i = 0; i < c.width + 1;) {
            let xpos = (a) => {
                return (1 - a / c.width) * minX + (a / c.width) * maxX
            };

            ctx.lineTo(i, c.height / (minY - maxY) * (f(type + '(' + input + ')', xpos(i)) + maxY - (maxY - minY)));

            i += precision;

            ctx.lineTo(i, c.height / (minY - maxY) * (f(type + '(' + input + ')', xpos(i)) + maxY - (maxY - minY)));

            ctx.strokeStyle = type == 're' ? '#0000FF' : '#FF0000';
            if (f(type + '(' + input + ')', xpos(i + 1)) == 0 && type != 're') {
                ctx.strokeStyle = 'rgba(0,0,0,0)'
            }
            ctx.stroke();
        }
    })
}

precision = [1, 2, 3, 5, 10, 15, 20, 25, 35, 50][$("precision").value - 1]
$("display1").innerHTML = precision;
document.getElementById('display1').parentElement.style.color = `hsl(${($('precision').value-1)**0.4*40},100%,50%)`;
w.m(['set precision', precision])


$("precision").oninput = () => {
    precision = [1, 2, 3, 5, 10, 15, 20, 25, 35, 50][$("precision").value - 1];
    $("display1").innerHTML = precision;
    document.getElementById('display1').parentElement.style.color = `hsl(${($('precision').value-1)**0.4*40},100%,50%)`;
    w.m(['set precision', precision]);
    input = document.getElementById('input').value;
    w.m(['graphAlpha', imgd, mnx, mxx, mny, mxy, input])
}

$("input").oninput = () => {
    input = document.getElementById('input').value;
    if (input == "") {input = "0"};
    let executable = true;
    try {f(input,0)} catch {executable = false};
    if (executable) {
    w.m(['set c dim',c.width,c.height])
    w.m(['graphAlpha', imgd, mnx, mxx, mny, mxy, input])};
    calcinput()
}

$("upload").addEventListener('change', handleFile)



window.onresize = () => {
    c.width = Math.min($('graphcontainer').clientWidth,window.innerWidth*.55);
    c.height = Math.min($('graphcontainer').clientHeight,window.innerHeight*.65);
    c.width = $('graphcontainer').clientWidth;
    c.height = $('graphcontainer').clientHeight;
    $('graphcontainer').style.width = ~~(window.innerWidth*.5)+'px';
    $('graphcontainer').style.height = ~~(window.innerHeight*.8)+'px';
    w.m(['set c dim',
    Math.min($('graphcontainer').clientWidth,window.innerWidth*.55),
    Math.min($('graphcontainer').clientHeight,window.innerHeight*.65)
]);
    w.m(['graphAlpha', imgd, mnx, mxx, mny, mxy, input])
    graph(mnx, mxx, mny, mxy)
}

$("graphcontainer").ondblclick = () => {
    c.width = $('graphcontainer').clientWidth;
    c.height = $('graphcontainer').clientHeight;
    mnx = -10;
    mxx = 10;
    mny = -10/c.width*c.height;
    mxy = 10/c.width*c.height;
    w.m(['set c dim',c.width,c.height]);
    w.m(['graphAlpha', imgd, mnx, mxx, mny, mxy, input])
}

$("graphcontainer").onmouseup = () => {
    w.m(['set c dim',c.width,c.height])
    input = document.getElementById('input').value;
    if (input == "") {input = "0"};
    w.m(['graphAlpha', imgd, mnx, mxx, mny, mxy, input])
}

c.addEventListener("wheel", (event) => {
    event.preventDefault();
}, {
    passive: false
});

let currentcwidth = c.width;
let currentcheight = c.height;

setInterval(()=>{
if (c.width != currentcwidth || c.height != currentcheight) {
    currentcwidth = c.width;
    currentcheight = c.height;
    w.m(['set c dim',c.width,c.height])
    w.m(['graphAlpha', ctx.getImageData(0,0,currentcwidth,currentcheight), mnx, mxx, mny, mxy, input])
}
},1)

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

function savePreset() {
    contents = '[\n'+
    '"'+$('input').value+'",\n'+
    '"'+$('title').value+'",\n'+
    '"'+$('description').value+'",\n'+
    '"'+mnx+'",\n'+
    '"'+mxx+'",\n'+
    '"'+mny+'",\n'+
    '"'+mxy+'",\n'+
    '"'+precision+'"\n]';
    writeFile(contents,$('preset-name').value)
}

presetnames.forEach((i)=>{a = document.createElement('button');
a.innerHTML = i;
a.setAttribute('onclick', 'myFunction(this)');
a.setAttribute('class', 'hoverable');
a.setAttribute('class', 'presethoverglow');
a.setAttribute('style', 'border-radius:5px');
$('presetcontainer').appendChild(a)});

function newPreset(expression, title, description) {
presetnames.push(title);
Presets.push([expression, title, description]);
a = document.createElement('button');
a.innerHTML = title;
a.setAttribute('onclick', 'myFunction(this)');
$('presetcontainer').appendChild(a)}

function handleFile() {
    const fileInput = $('upload');
    const file = fileInput.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const contents = event.target.result;
        let parsedcontents;
        try {JSON.parse(contents)+0} catch {parsedcontents = 'Error'};
        if (parsedcontents != 'Error') {
        parsedcontents = JSON.parse(contents)
        };
        let p = parsedcontents;
        console.log(parsedcontents)
        if (Array.isArray(parsedcontents) && parsedcontents.length == 8) {
            $('input').innerHTML = p[0];
            $('title').innerHTML = p[1];
            $('description').innerHTML = p[2];
            mnx=p[3]*1;mxx=p[4]*1;mny=p[5]*1;mxy=p[6]*1;
            $('precision').innerHTML = p[7];
            ['set precision', precision];
            graph(mnx, mxx, mny, mxy);
            document.location='#presetload'
        } else {
            console.log('This file is not a valid preset file.');
            ctx.font = "21px MonospaceTypeWriter";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            if (c.width < 600) {
                ctx.fillText("Error", c.width / 2, c.height / 2 - 10);
                ctx.fillText("The file you provided is", c.width / 2, c.height / 2 + 5);
                ctx.fillText("not a valid preset file.", c.width / 2, c.height / 2 + 20)
            } else {
                ctx.fillText("The file you provided is not a valid preset file.", c.width / 2, c.height / 2);
            };
            document.location='#presetload';
            ctx.lineWidth = 1;
        }
      };
      reader.readAsText(file);
    } else {
      console.log('No file selected.');
    }
  }

  // Popup systems

$('popup-settings-x').addEventListener("click", function() {
    $('popup-settings').style.opacity = "0";
    $('popup-background').style.opacity = "0";

  setTimeout(function() {
    $('popup-settings').setAttribute("fading", "true");
    $('popup-background').hidden = true
  }, 200);
});

$('popup-settings-ok').addEventListener("click", function() {
    $('popup-settings').style.opacity = "0";
    $('popup-background').style.opacity = "0";

  setTimeout(function() {
    $('popup-settings').setAttribute("fading", "true");
    $('popup-background').hidden = true
  }, 200);

['mnx','mxx','mny','mxy'].forEach((i)=>{
    Function(i + " = " + $('settings-'+i).value * (['mny','mxy'].includes(i)?-1:1))()
});
w.m(['graphAlpha', imgd, mnx, mxx, mny, mxy, input])
})

$('button-settings').addEventListener("click", function () {
    $('popup-background').hidden = false;
    $('popup-settings').hidden = false;
    ['mnx','mxx','mny','mxy'].forEach((i)=>{
    $('settings-'+i).value=(Function('return '+i)().toPrecision(6))*(['mny','mxy'].includes(i)?-1:1)
    })

    setTimeout(function() {
    $('popup-settings').setAttribute("fading", "true");
    $('popup-settings').style.opacity = "1";
    $('popup-background').style.opacity = "1";
    },0)
});

$('button-save').addEventListener("click", function () {
    $('popup-background').hidden = false;
    $('popup-save').hidden = false;
    $('preset-name').value = 'MathjsGrapher_'+$('title').value+""+(($('title').value == '')?"Untitled":"")

    setTimeout(function() {
    $('popup-save').setAttribute("fading", "true");
    $('popup-save').style.opacity = "1";
    $('popup-background').style.opacity = "1";
    },0)
});

$('popup-save-x').addEventListener("click", function() {
    $('popup-save').style.opacity = "0";
    $('popup-background').style.opacity = "0";

  setTimeout(function() {
    $('popup-save').setAttribute("fading", "true");
    $('popup-background').hidden = true
  }, 200);
});

$('popup-save-ok').addEventListener("click", function() {
    $('popup-save').style.opacity = "0";
    $('popup-background').style.opacity = "0";
    savePreset();
    $('notification').innerHTML = "Saved as: "+$('preset-name').value+".txt";
    $('notification').style.right = "0vh"
    setTimeout(()=>{$('notification').style.right = "-100vh";},3000)

  setTimeout(function() {
    $('popup-save').setAttribute("fading", "true");
    $('popup-background').hidden = true
  }, 200);
});
ctx.font = c.width/25+'px "Pixeleum 48 Extended"';
$('button-copy').addEventListener("click", function () {

    ctx.font = c.width/25+'px "Pixeleum 48 Extended"';
    ctx.fillStyle = "rgba(0,0,0,25%)";
    ctx.textAlign = "left";
    ctx.fillText("Made with",0,c.height-10-c.width/25);
    ctx.fillText("Mathjs Grapher",0,c.height-5);

    c.toBlob(function(blob) { 
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]); 
    }); 

    $('notification').innerHTML = "Copied to clipboard!";
    $('notification').style.right = "0vh"
    setTimeout(()=>{$('notification').style.right = "-100vh";},3000)
});

const div1 = document.getElementById('input');
const div2 = document.getElementById('calcresultcontainer');

window.addEventListener('scroll', handleScroll);

function handleScroll() {
  const div1Bottom = div1.getBoundingClientRect().bottom + window.pageYOffset;
  const div2Top = div2.getBoundingClientRect().top + window.pageYOffset;
  const div1TextBottom = div1.getBoundingClientRect().bottom;

  if (div1TextBottom >= div2Top && div1TextBottom <= div2Top + div1.offsetHeight) {
    const proximity = div1TextBottom - div2Top;
    const opacity = 1 - proximity / div1.offsetHeight;
    div2.style.opacity = opacity;
  } else {
    div2.style.opacity = 1;
  }
}
  
  
  
  
  