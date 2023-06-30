var Presets =
[
['sin(x)','Sine Wave','This is the graph of a sine wave. This is also called a sinusoidal wave. The period of this wave is 2*pi=6.28318...',-10,10,-10,10,true],
['cos(x)','Cosine Wave','This is the graph of a cosine wave. This function is the derivative of the sine function.',-10,10,-10,10,true],
['1/x','Hyperbola','',-10,10,-10,10,true],
['re(sqrt(1-x^2))','Semicircle','',-1.5,1.5,-1,2,true],
['bitXor(floor(x),42)-x','Fractal','',34.0352,220.3,-69.1502,68.0107,false],
['asin(sin(x*pi/2))/pi*2','Triangle','',-10,10,-10,10,true],
['map(range(1,20),v=v^2)','Square numbers 1-20','',-10,10,-10,10,true],
[`concat("<span style='background-color:black;color:white;text-shadow:2px 2px 5px'>Markup_</span>","_Text")`,'Markup Text','',-10,10,-10,10,true],
["[54 km/h to m/s,15 km to m,1 kWh to kJ]",'Unit Conversion','',-10,10,-10,10,true],
["gamma(x+1)",'Factorial','',-1,10,-1e3,14e3,false],
["re((1-((x%2)-1)^2)^0.5)*((x%4>2)-0.5)*2",'Semicircular Wave','This is a wave made out of semicircles with a radius of 1.',-10,10,-10,10,true],
["0.5x^2-1+i*(-sin(x))",'Two graphs with complex numbers','',-10,10,-10,10,true],
["(-5<x&x<5)*sin(x)",'Interval','This graph displays sin(x) for an interval of \n-5 < x < 5.',-10,10,-10,10,true],
["map(1:10,v=1)",'Array of ones','',-10,10,-10,10,true],
["(-1)^x",'(-1)^x','Sine and cosine waves with period of 2.',-10,10,-10,10,true],
["sin(x)+sin(10x)/10+sin(100x)/100",'Sineception','Sine wave which is in a sine wave which is in a sine wave. Try zooming in the graph to see the fractal pattern!',-10,10,-10,10,true],
["re((1-x^2)^0.5)-re((1-x^2)^0.5)*i",'Circle','Circle constructed using the real and imaginary semicircles.',-2,2,-2,2,true],
["(x^2<=1?i:0)+1e-15i+(x^2<=1?-1:0)",'Square','',-2,2,-2,2,true],
["x-floor(x)",'Sawtooth Wave','',-3,3,-3,3,true],
["2floor(sin(xpi/2))+1",'Square Wave','',-10,10,-10,10,true],
["[\nO={a:1,b:-1,c:-2};\n(O.a)x^2+(O.b)x+O.c\n][2,1]",'Quadratic Function','',-10,10,-10,10,true],
["[\nf(x)=x^2+15x;\nf(5)\n][2,1]",'Function','When defining and using functions, the function definition and the result of the function is stored in an array. To access the result, we use array indexes.',-10,10,-10,10,true],
["filter(1:100,isPrime)",'Prime Numbers','',-10,10,-10,10,true],
["[w=\n\"This is a sample text.\";\nv=\"\";\nfct(a,b)=v=concat(v,\"<span style=\'color:hsla(\",string((a-1)*18),\",100%,50%)\'>\",w[a],\"<\/span>\");\nforEach(1:count(w),fct(n,1));v][5,1]",'Rainbow Text','You can change the text by tweaking the code. For example, try changing the "This is a sample text." to some other text. You can also tweak the hue, luminance and saturation.',-10,10,-10,10,true],
["[v='';\nf(a)=v=concat(v,string(a),v);\nforEach(1:5,f);v][4,1]",'Recursion','',-10,10,-10,10,true],
["[NSN(n)=(sqrt(n)+1)^2;\nNSN(9)\n][2,1]",'Next Square Number','The Next Square Number function.\nIf n is a square number, NSN(n) will output the next square number!',-10,10,-10,10,true],
["map(1:15,v=v*(v+1)/2)",'Triangular Numbers','n is a triangular number if you can arrange n objects such that it forms an equilateral triangle.',-10,10,-10,10,true],
["a=[1,1];\nf(x)=a=concat(a,[round(a[count(a)]*phi)]);\nforEach(1:5,f);a",'Fibonacci Sequence','',-10,10,-10,10,true],
["a=[1,1,1];\nc=count(a)-1;f(x)=a=concat(a,[round(a[count(a)]+a[count(a)-1]+a[count(a)-2])]);forEach(1:10,f);a",'Tribonacci (3-acci)','',-10,10,-10,10,true],
["a=[1,1,1,1,1];\nc=count(a)-1;\nf(x)=a=concat(a,[round(\nsum(map(0:c,b=a[count(a)-b]))\n)]);forEach(1:10,f);a",'Generalized n-acci','',-10,10,-10,10,true],
["collatz(n)=n%2?3n+1:n/2;\ncollatz(7)",'Collatz Conjecture',"This is a function that simulates the Collatz conjecture.\n\nIf n is odd, it outputs 3n+1. If n is even, it outputs n/2\n\nHere's a sequence starting at 7: 7 -> 22 -> 11 -> 34 -> 17 -> 52 -> 26 -> 13 -> 40 -> 20 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1 -> 4 -> 2 -> 1...\n\nCollatz conjecture states that every natural number in the sequence will eventually fall back to 1.\n\nA computer tested the conjecture for integers from 1 to ~2.95*10^20, and none of them disproved the conjecture. However, this does not prove the conjecture.",-10,10,-10,10,true],
["concat('<span style=font-size:',\nstring(sin((Date)%2000/2000*pi)^2*10+25),\n'px>Animated Text</span>')",'Animated Text','',-10,10,-10,10,true],
["[a=0;f(n)=a=a+\nn^3;\nforEach(1:4,f);a][4,1]",'Summation','n from 1 to 4, n^3. 1^3+2^3+3^3+4^3=100\nAlso, you can add the variable x in the function\'s expression to add graphs together.',-10,10,-10,10,true],
["[a=0;\nf(n)=a=a+(sin(x*n*pi/4)+sin(n*pi-x*n*pi/4))/n;\nforEach(1:50,f);a][4,1]",'Fourier Series','',-10,10,-10,10,true],
["[clamp(a,b,c)=min(-min(-b,a*(-1)),c);\nclamp(-2,x,3)\n][2,1]",'Clamp function','',-10,10,-10,10,true],
["e^(-x^2)",'Gaussian','This is the Gaussian function. There is an integral for this function called the Gaussian integral, which is equal to √π.',-10,10,-10,10,true],
["(abs(x)>pi/2)*(-sin(x)+sign(x))+sin(x)",'S-curved Sine','sin(x) but constant for |x| greater than π/2',-3,3,-3,3,true],
["erfx",'Error Function','',-10,10,-10,10,true],
["1/(1+100^-x)",'Sigmoid 1','',-3,3,-3,3,true],
["(abs(1+(x+1)i)-abs(x-1+i))/2",'Sigmoid 2','',-5,5,-5,5,true],
["atan(xpi/2)2/pi",'Sigmoid 3','',-10,10,-10,10,true],
["log2(10^10+10^((x^0.3-3)^0.5*20))",'Logarithmic Significance','',-5.52798,165.002,-13.52,112.24,false],
["e^(pi*i)",'e to the pi i','This actually just equals 1, without imaginary part. This inaccuracy is due to floating point precision errors.',-10,10,-10,10,true],
["[\n0b11000000111001+0b10000111,\n0b10^0b1011,\nbin(100)\n]",'Binary','',-10,10,-10,10,true],
["floor(random(0,1)^-1)",'Random','Random reciprocal of a number from 0 to 1 as an integer.',-10,10,-10,10,true],
["sinh(sinh(sin(x*i)*i)*i+1)",'Chaos','',-10,10,-10,10,true],
["log10(x)+e^((x-8)-(x/2-4)^2)",'Weird logarithm','',-2.63324,22.3668,-6.75952,11.5421,true],
["filter(1:100,isPrime)[floor(x>0&x<count(filter(1:100,isPrime))?x:0)+1]",'nth Prime Number function','',-10,10,-10,10,true],
["4-(4-abs(x))^2-(4-(4-abs(x))^2)*i",'Quadruple Parabola','',-10,10,-10,10,true],
[`[w=\n"This is the 50th Mathjs Grapher Preset! More rainbow text!!! This text is wavy and has lots of effects.";\nv="";\nfct(a,b)=v=concat(v,"<span style='background-color:hsla(",string((a-1)*12+(Date/5)%360),",100%,10%);color:hsla(",string((a-1)*12+(Date/5)%360),",100%,75%);position:relative;bottom:",string(3*sin(a/5+Date/2000)),"px;font-size:",string(25+1sin(a/5+(Date/1000)%30)),"px'>",w[a],"</span>");\nforEach(1:count(w),fct(n,1));v][5,1]`,'The 50th Preset','',-10,10,-10,10,true]
];

// Preset format: Expression, Name, Minimum X, Maximum X, Minimum Y, Maximum Y, Sync to canvas aspect.

var presetnames = Presets.map((a)=>{return a[1]})

function loadPreset(element) {
    let aspect = c.width/c.height
    let p = Presets[presetnames.indexOf(element.innerHTML)];
    /*$*/document.getElementById('input').value = p[0];
    /*$*/document.getElementById('title').value = p[1];
    /*$*/document.getElementById('description').value = p[2];
    mnx=p[3];
    mxx=p[4];
    mny=-1*p[6]/(p[7]?aspect:1);
    mxy=-1*p[5]/(p[7]?aspect:1);
    document.location='#presetload';
    try {calcinput()} catch {};
    graph(mnx,mxx,mny,mxy);
}