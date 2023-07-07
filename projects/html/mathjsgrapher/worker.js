var fArray = new Array();
self.m = (x,y) => {
  if (y != undefined) {
  x.msg = y;
  self.postMessage(x)
  } else {
  self.postMessage(x)
  }
};
let Testvalue = 'functinos';
let mnx, mxx, mny, mxy, width, height, precision, c, ctx, f_x, f_x_i, imgd;

self.addEventListener('message', (event) => {

  let data = event.data;
  
  fArray['set xy range'] = ()=>{
    mnx = data[1];
    mxx = data[2];
    mny = data[3];
    mxy = data[4];
    m([mnx,mxx,mny,mxy],'log');
  }

  fArray['set precision'] = ()=>{
    precision = data[1];
    m([precision],'log');
  };

  fArray['ss'] = ()=>{
    m('3');
  };

  fArray['set f(x)'] = ()=>{
    f_x = data[1];
    f_x_i = data[2];
    m([f_x,f_x_i],'log');
  }

  fArray['set c dim'] = ()=>{
    width = data[1]
    height = data[2];
    m('Done. The new dimensions are:\n'+'Width: '+width+'\nHeight: '+height)
  }

  fArray['width'] = ()=>{
    m(width);
  }

  fArray['Give me the SCRIPTS'] = ()=>{
    importScripts('../../lnls/math.js');
    m('Done.' + Testvalue, 'log');
    function f(x, y) {
      //date = Date.now();
      //x = x.replace(/Date/g, '(' + date + ')');
      return math.evaluate((x).replace(/x/g, '(' + y + ')'))
  };
    m(f('x^0.5',-1))
    m('Function executed.','log')
  }

  fArray['testf'] = ()=>{
    m('say' + f('x^2',5))
  };

  fArray['VALUES'] = ()=>{
    //m([mnx,mxx,mny,mxy]);
    m(f_x+'')
  };

  fArray['canvas dim'] = ()=>{
    m('Width: '+width+'\nHeight: '+height,'log')
  };

  fArray['say'] = ()=>{
    m(data[1],'log')
  };

  fArray['draw text'] = ()=>{
    c = new OffscreenCanvas(data[1].width,data[1].height);
    ctx = c.getContext('2d',{willReadFrequently:true});
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.width, c.height);

    
    ctx.font = "21px MonospaceTypeWriter";
    ctx.fillStyle = "teal";
    ctx.textAlign = 'center';
    ctx.fillText('done',c.width/2,c.height/2);

    imgd = ctx.getImageData(0,0,c.width,c.height);
    m([imgd],'draw text')
  };

  fArray['graph'] = ()=>{
    c = new OffscreenCanvas(data[1].width,data[1].height);
    ctx = c.getContext('2d',{willReadFrequently:true});
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.width, c.height);

    
    ctx.font = "21px MonospaceTypeWriter";
    ctx.fillStyle = "olive";
    ctx.textAlign = 'center';
    ctx.fillText('Placeholder for graph',c.width/2,c.height/2);

    imgd = ctx.getImageData(0,0,c.width,c.height);
    m([imgd],'draw text')
  };

  fArray['graphAlpha'] = ()=>{
    date = Date.now();
    data[6] = data[6].replace(/Date/g, '(' + date + ')');
    c = new OffscreenCanvas(data[1].width,data[1].height);
    ctx = c.getContext('2d',{willReadFrequently:true});
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.width, c.height);

    c.width = width;c.height = height;

    minX=data[2];maxX=data[3];
    minY=data[4];maxY=data[5];

    drawgrid = (minX, maxX, minY, maxY) => {

      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, c.width, c.height);
      
      let aspect = c.width / c.height // Aspect ratio of the viewport.
      // A<1 = tall rectangle, A=1 = square, A>1 = wide rectangle

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
  };
  function fixnum(n) {

    a = (Math.abs(n) >= 1e6 || Math.abs(n) < 1e-3 && n != 0) ?

        Math.round(1e3 * (n / (10 ** Math.floor(Math.log10(Math.abs(n) + (1 - Math.sign(n) ** 2)))) + 1e-6 * Math.sign(n))) / 1e3

        +
        '\u00d710^' +

        Math.floor(Math.log10(Math.abs(n))) :
        Math.floor(n * 1e3 + 1e-7) / 1e3;

    return a
};
drawgrid(minX, maxX, minY, maxY);
    ['re', 'im'].forEach((type) => {
      ctx.beginPath();
      for (i = 0; i < c.width + 1;) {
          let xpos = (a) => {
              return (1 - a / c.width) * minX + (a / c.width) * maxX
          };
          
          
          function f(x, y) {
            return math.evaluate((x).replace(/x/g, '(' + y + ')'))
          };

          ctx.lineTo(i, c.height / (minY - maxY) * (f(type + '(' + data[6]/*Input*/ + ')', xpos(i)) + maxY - (maxY - minY)));

          i += precision;

          ctx.lineTo(i, c.height / (minY - maxY) * (f(type + '(' + data[6] + ')', xpos(i)) + maxY - (maxY - minY)));

          ctx.strokeStyle = type == 're' ? '#0000FF' : '#FF0000';
          if (f(type + '(' + data[6] + ')', xpos(i + 1)) == 0 && type != 're') {
              ctx.strokeStyle = 'rgba(0,0,0,0)'
          }
          ctx.stroke();
      }
  })

    imgd = ctx.getImageData(0,0,c.width,c.height);
    m([imgd],'draw text')
  };

  fArray['ctx'] = ()=>{
    ctx = data[0]
  };

  m(data[0])
  fArray[data[0]]()

  if (data.canvas != undefined) {
    canvas = data.canvas;
    m(btoa(canvas))
  }
})
