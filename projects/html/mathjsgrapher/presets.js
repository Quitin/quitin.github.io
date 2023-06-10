var Presets =
[
['sin(x)','Sine Wave','This is the graph of a sine wave. This is also called a sinusoidal wave. The period of this wave is 2*pi=6.28318...',-10,10,-10,10,true],
['cos(x)','Sine Wave2','This is the graph of a cosine wave. This function is the derivative of the sine function.',-10,10,-10,10,true]
];
var presetnames = Presets.map((a)=>{return a[1]})

function myFunction(element) {
    let aspect = c.width/c.height
    let p = Presets[presetnames.indexOf(element.innerHTML)];
    /*$*/document.getElementById('input').value = p[0];
    /*$*/document.getElementById('title').value = p[1];
    /*$*/document.getElementById('description').value = p[2];
    mnx=p[3];
    mxx=p[4];
    mny=p[5]/(p[7]?aspect:1);
    mxy=p[6]/(p[7]?aspect:1);
    document.location='#presetload'
    graph(mnx,mxx,mny,mxy)
}