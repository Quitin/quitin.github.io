var Presets =
[
['sin(x)','Sine Wave','This is the graph of a sine wave. This is also called a sinusoidal wave. The period of this wave is 2*pi=6.28318...'],
['cos(x)','Sine Wave2','This is the graph of a cosine wave. This function is the derivative of the sine function.']
];
var presetnames = Presets.map((a)=>{return a[1]})

function myFunction(element) {
    let p = Presets[presetnames.indexOf(element.innerHTML)];
    /*$*/document.getElementById('input').innerHTML = p[0];
    /*$*/document.getElementById('title').innerHTML = p[1];
    /*$*/document.getElementById('description').innerHTML = p[2];
    document.location='#presetload'
    graph(mnx,mxx,mny,mxy)
}