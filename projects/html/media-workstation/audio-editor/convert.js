//totally not stolen from bonesyt audio effect maker lmao

Array.prototype.toAudio = function (sampleRate=48e3, isBuffer=false) {
    let audio = new Audio

    var ar = this
    var a = new (window.AudioContext || window.webkitAudioContext)()
    var b = a.createBuffer(this.length, this[0].length, sampleRate)
    for (var c = 0; c < this.length; c++) {
        var d = b.getChannelData(c)
        for (var i = 0; i < b.length; i++) {
            d[i] = ar[c][i]
        }
    }
    var s = a.createBufferSource()
    s.buffer = b
    s.connect(a.destination)

    if (!isBuffer) {
        const [L, R] =  [b.getChannelData(0), b.getChannelData(1)]

        const d = new Float32Array(L.length + R.length)
        for (let src=0, dst=0; src < L.length; src++, dst+=2) {
            d[dst] =   L[src]
            d[dst+1] = R[src]
        }
    
        // get WAV file bytes and audio params of your audio source
        const w = getWavBytes(d.buffer, {
            isFloat: true,       // floating point or 16-bit integer
            numChannels: 2,
            sampleRate: sampleRate,
        })
        const W = new Blob([w], {type: 'audio/wav'})
        audio.src = URL.createObjectURL(W)
    }

    return isBuffer ? s : audio
}

String.prototype.audioToArray = async function (withBuffer = 0) {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var src = this+''
    var s, f = []

    await new Promise(p => {
    var r = new XMLHttpRequest();
    r.open('GET', src, true);
    r.responseType = 'arraybuffer';
    r.onload = () => {
        var a = r.response;
        ctx.decodeAudioData(a, a => {
            s = ctx.createBufferSource();
            s.buffer = a;
            s.connect(ctx.destination);

            for (var i = 0; i < s.channelCount; i++) {
                f.push(s.buffer.getChannelData(i))
            }

            p()
        }, e => {throw e})
    }
    r.send()
    })

    return withBuffer ? {
        buffer: s.buffer,
        samples: f
    } : f
}

function createWavHeader(numChannels, sampleRate, bitsPerSample, dataLength) {
    const header = new DataView(new ArrayBuffer(44));
    const dataLengthInBytes = dataLength * numChannels * (bitsPerSample / 8);
  
    header.setUint32(0, 0x46464952, false); // "RIFF" in ASCII
    header.setUint32(4, 36 + dataLengthInBytes, true); // Total file size - 8
    header.setUint32(8, 0x45564157, false); // "WAVE" in ASCII
    header.setUint32(12, 0x20746D66, false); // "fmt " in ASCII
    header.setUint32(16, 16, true); // Size of the fmt chunk
    header.setUint16(20, 1, true); // Audio format (1 for PCM)
    header.setUint16(22, numChannels, true); // Number of channels
    header.setUint32(24, sampleRate, true); // Sample rate
    header.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // Byte rate
    header.setUint16(32, numChannels * (bitsPerSample / 8), true); // Block align
    header.setUint16(34, bitsPerSample, true); // Bits per sample
    header.setUint32(36, 0x61746164, false); // "data" in ASCII
    header.setUint32(40, dataLengthInBytes, true); // Size of the data chunk
  
    return header;
  }

  function createWavDataUrl(samples, sampleRate, numChannels, bitsPerSample) {
    const header = createWavHeader(numChannels, sampleRate, bitsPerSample, samples.length / numChannels);
    const wavBlob = new Blob([header, samples], { type: 'audio/wav' });
    const dataUrl = URL.createObjectURL(wavBlob);
    return dataUrl;
  }

  const audioSamples = new Uint8Array( /* your audio samples here */ );

// Create the data URL for the .wav file
const wavDataUrl = createWavDataUrl(audioSamples, sampleRate, numChannels, bitsPerSample);

function getWavHeader(options) {
    const numFrames =      options.numFrames
    const numChannels =    options.numChannels || 2
    const sampleRate =     options.sampleRate || 44100
    const bytesPerSample = options.isFloat? 4 : 2
    const format =         options.isFloat? 3 : 1
  
    const blockAlign = numChannels * bytesPerSample
    const byteRate = sampleRate * blockAlign
    const dataSize = numFrames * blockAlign
  
    const buffer = new ArrayBuffer(44)
    const dv = new DataView(buffer)
  
    let p = 0
  
    function A(s) {
      for (let i = 0; i < s.length; i++) {
        dv.setUint8(p + i, s.charCodeAt(i))
      }
      p += s.length
    }
  
    function C(d) {
      dv.setUint32(p, d, true)
      p += 4
    }
  
    function B(d) {
      dv.setUint16(p, d, true)
      p += 2
    }
  
    A('RIFF')              // ChunkID
    C(dataSize + 36)       // ChunkSize
    A('WAVE')              // Format
    A('fmt ')              // Subchunk1ID
    C(16)                  // Subchunk1Size
    B(format)              // AudioFormat https://i.stack.imgur.com/BuSmb.png
    B(numChannels)         // NumChannels
    C(sampleRate)          // SampleRate
    C(byteRate)            // ByteRate
    B(blockAlign)          // BlockAlign
    B(bytesPerSample * 8)  // BitsPerSample
    A('data')              // Subchunk2ID
    C(dataSize)            // Subchunk2Size
  
    return new Uint8Array(buffer)
}

function getWavBytes(buffer, options) {
    const type = options.isFloat ? Float32Array : Uint16Array
    const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT
  
    const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }))
    const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);
  
    // prepend header, then add pcmBytes
    wavBytes.set(headerBytes, 0)
    wavBytes.set(new Uint8Array(buffer), headerBytes.length)
  
    return wavBytes
}