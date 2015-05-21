//Code borrowed from RecorderJS

class Export {
  constructor(audioBuffer) {
    console.log(audioBuffer);
    this.audioBuffer = audioBuffer;
    this.sampleRate = audioBuffer.sampleRate;
    this.numChannels = audioBuffer.numberOfChannels;
    this.recBuffers = [];
    this.recLength = audioBuffer.length;
    this.recBuffers.push(this.audioBuffer.getChannelData(0));
  }
  export() {
    var buffers = [];
    for (var channel = 0; channel < this.numChannels; channel++){
      buffers.push(this.mergeBuffers(this.recBuffers, this.recLength));
    }
    if (this.numChannels === 2){
      var interleaved = this.interleave(buffers[0], buffers[1]);
    } else {
      var interleaved = buffers[0];
    }
    var dataview = this.encodeWAV(interleaved);
    var audioBlob = new Blob([dataview], { type: 'audio/wav' });
    return audioBlob;
  }
  interleave(inputL, inputR) {
    var length = inputL.length + inputR.length;
    var result = new Float32Array(length);

    var index = 0,
    inputIndex = 0;

    while (index < length){
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }
    return result;
  }
  mergeBuffers(recBuffers, recLength){
    console.log(recBuffers);
    var result = new Float32Array(recLength);
    var offset = 0;
    for (var i = 0; i < recBuffers.length; i++){
      result.set(recBuffers[i], offset);
      offset += recBuffers[i].length;
    }
    return result;
  }
  writeString(view, offset, string){
    for (var i = 0; i < string.length; i++){
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  encodeWAV(samples){
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);

    /* RIFF identifier */
    this.writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    this.writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    this.writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, this.numChannels, true);
    /* sample rate */
    view.setUint32(24, this.sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, this.sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, this.numChannels * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    this.writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    this.floatTo16BitPCM(view, 44, samples);

    return view;
  }
  floatTo16BitPCM(output, offset, input){
  for (var i = 0; i < input.length; i++, offset+=2){
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}
}