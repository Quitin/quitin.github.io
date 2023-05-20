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
w.addEventListener('message', (event) => {
    // Handle message received from worker
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
        //w.m(['graphAlpha', imgd, mnx + dx, mxx + dx, mny + dy, mxy+ dy, input])
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
    //drawgrid(mnx, mxx, mny, mxy);
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
    //graph(mnx,mxx,mny,mxy);
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

drawgrid = (minX, maxX, minY, maxY) => {

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.width, c.height);

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

    let gridStepY = 10 ** (Math.floor(Math.log10((maxY - minY) / autozoomFactor)));

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

    let axisgridStepY = [2, 5, 10][Math.floor((Math.log10((maxY - minY) / 10) - Math.floor(Math.log10((maxY - minY) / 10))) * 3)] * 10 ** (Math.floor(Math.log10((maxY - minY) / 10)))

    for (let i = axisgridStepY * Math.ceil(minY / axisgridStepY); i <= maxY; i += axisgridStepY) {
        ctx.beginPath();
        const yPos = ((i - minY) / (maxY - minY)) * c.height;
        ctx.font = "16px MonospaceTypewriter";
        ctx.fillStyle = "black";
        if (Math.abs(yPos / i) <= 1e15) {
            ctx.fillText(fixnum(-i), Math.min(Math.max(minX / (minX - maxX) * c.width, 2), c.width - 12 - (Math.abs(i) >= 1e6 ? 15 : 0) - 10 * Math.min(6, Math.floor(Math.log10(Math.abs(i) + 1 - Math.sign(i) ** 2)))), yPos)
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

            ctx.lineTo(i + 1, c.height / (minY - maxY) * (f(type + '(' + input + ')', xpos(i + 1)) + maxY - (maxY - minY)));

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
    //w.m(['Give me the SCRIPTS']);
    input = document.getElementById('input').value;
    w.m(['graphAlpha', imgd, mnx, mxx, mny, mxy, input])
    //graph(mnx, mxx, mny, mxy)
}

$("input").oninput = () => {
    input = document.getElementById('input').value;
    if (input == "") {input = "0"};
    let executable = true;
    try {f(input,0)} catch {executable = false};
    if (executable) {
    //c.width = $('graphcontainer').clientWidth;
    //c.height = $('graphcontainer').clientHeight;
    w.m(['set c dim',c.width,c.height])
    //w.m(['Give me the SCRIPTS']);
    
    
    w.m(['graphAlpha', imgd, mnx, mxx, mny, mxy, input])}
    //graph(mnx, mxx, mny, mxy);
}

window.onresize = () => {
    c.width = Math.min($('graphcontainer').clientWidth,window.innerWidth*.55);
    c.height = Math.min($('graphcontainer').clientHeight,window.innerHeight*.65);
    //c.width = $('graphcontainer').clientWidth;
    //c.height = $('graphcontainer').clientHeight;
    $('graphcontainer').style.width = ~~(window.innerWidth*.5)+'px';
    $('graphcontainer').style.height = ~~(window.innerHeight*.8)+'px';
    w.m(['set c dim',c.width,c.height]);
    w.m(['graphAlpha', imgd, mnx, mxx, mny, mxy, input])
    //graph(mnx, mxx, mny, mxy)
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
    //graph(mnx, mxx, mny, mxy)
}

$("graphcontainer").onmouseup = () => {
    //c.width = $('graphcontainer').clientWidth;
    //c.height = $('graphcontainer').clientHeight;
    //graph(mnx, mxx, mny, mxy);
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

presetnames.forEach((i)=>{a = document.createElement('button');
a.innerHTML = i;
a.setAttribute('onclick', 'myFunction(this)');
$('presetcontainer').appendChild(a)});

function newPreset(expression, title, description) {
presetnames.push(title);
Presets.push([expression, title, description]);
a = document.createElement('button');
a.innerHTML = title;
a.setAttribute('onclick', 'myFunction(this)');
$('presetcontainer').appendChild(a)}