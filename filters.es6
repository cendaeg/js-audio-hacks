var bufferSize = 4096;
class lowpass {
    constructor(ctx) {
        var lastOut = 0.0;
        this.node = ctx.createScriptProcessor(bufferSize, 1, 1);
        this.node.onaudioprocess = function(e) {
            var input = e.inputBuffer.getChannelData(0);
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                output[i] = (input[i] + lastOut) / 2.0;
                lastOut = output[i];
            }
        }
    }
}