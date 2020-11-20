function Main()
{
	var romData = Controls.Rom__.GetValue();
	var gameName = Controls.Game_name__.GetValue();
	
	if (gameName)
	{
		Controls.Title__.SetText(gameName);
	}
	
	if (!romData)
	{
		return;
	}
	
	var document = Controls.Document;
	var jsnes = Controls.NES;
	
	var AUDIO_BUFFERING = 512;
	var SAMPLE_COUNT = 4*1024;
	var SAMPLE_MASK = SAMPLE_COUNT - 1;
	var audio_samples_L = new Float32Array(SAMPLE_COUNT);
	var audio_samples_R = new Float32Array(SAMPLE_COUNT);
	var audio_write_cursor = 0, audio_read_cursor = 0;
	var audio_ctx = null;
	
	var canvas = null;
	var context = null;
	var imageData = null;
	var buf = null;
	var buf8 = null;
	var buf32 = null;
	
	function audio_remain(){
		return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
	}
	
	function audio_callback(event){
		var dst = event.outputBuffer;
		var len = dst.length;
		
		// Attempt to avoid buffer underruns.
		if(audio_remain() < AUDIO_BUFFERING) nes.frame();
		
		var dst_l = dst.getChannelData(0);
		var dst_r = dst.getChannelData(1);
		for(var i = 0; i < len; i++){
			var src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
			dst_l[i] = audio_samples_L[src_idx];
			dst_r[i] = audio_samples_R[src_idx];
		}
		
		audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
	}
	
	function initCanvas() {
		canvas = document.getElementById("myCanvas");
		context = canvas.getContext("2d");
		imageData = context.getImageData(0, 0, 256, 240);
		
		context.fillStyle = "black";
		// set alpha to opaque
		context.fillRect(0, 0, 256, 240);
		
		// buffer to write on next animation frame
		buf = new ArrayBuffer(imageData.data.length);
		// Get the canvas buffer in 8bit and 32bit
		buf8 = new Uint8ClampedArray(buf);
		buf32 = new Uint32Array(buf);
		
		// Set alpha
		for (var i = 0; i < buf32.length; ++i) {
			buf32[i] = 0xff000000;
		}
		
		// Setup audio.
		audio_ctx = new Controls.AudioContext();
		var script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
		script_processor.onaudioprocess = audio_callback;
		script_processor.connect(audio_ctx.destination);
	}
	
	function setBuffer(buffer)
	{
		var i = 0;
		for (var y = 0; y < 240; ++y) {
			for (var x = 0; x < 256; ++x) {
				i = y * 256 + x;
				// Convert pixel from NES BGR to canvas ABGR
				buf32[i] = 0xff000000 | buffer[i]; // Full alpha
			}
		}
	}
	
	function writeBuffer()
	{
		imageData.data.set(buf8);
		context.putImageData(imageData, 0, 0);
	}
	
	function play()
	{
		nes.frame();
		setTimeout(() => {
			play();
		}, 13);
	}
				
	// Initialize and set up outputs
	var nes = new jsnes.NES({
		onFrame: function(frameBuffer) {
			// ... write frameBuffer to screen
			setBuffer(frameBuffer);
			writeBuffer();
		},
		onAudioSample: function(l, r) {
			audio_samples_L[audio_write_cursor] = l;
			audio_samples_R[audio_write_cursor] = r;
			audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
		}
	});
		
	initCanvas();

	// Load ROM data as a string or byte array
	nes.loadROM(atob(romData));
		
	// Run frames at 60 fps, or as fast as you can.
	// You are responsible for reliable timing as best you can on your platform.
	play();
		
	document.addEventListener('keydown', (event) => {
		const keyName = event.key;
		switch(keyName)
		{
			case 'Enter':
				nes.buttonDown(1, jsnes.Controller.BUTTON_START);
				break;
			case ' ':
				nes.buttonDown(1, jsnes.Controller.BUTTON_SELECT);
				break;
			case 'x':
				nes.buttonDown(1, jsnes.Controller.BUTTON_A);
				break;
			case 'w':
				nes.buttonDown(1, jsnes.Controller.BUTTON_B);
				break;
			case 'ArrowRight':
				nes.buttonDown(1, jsnes.Controller.BUTTON_RIGHT);
				break;
			case 'ArrowLeft':
				nes.buttonDown(1, jsnes.Controller.BUTTON_LEFT);
				break;
			case 'ArrowDown':
				nes.buttonDown(1, jsnes.Controller.BUTTON_DOWN);
				break;
			case 'ArrowUp':
				nes.buttonDown(1, jsnes.Controller.BUTTON_UP);
				break;
		}
	});
		
	document.addEventListener('keyup', (event) => {
		const keyName = event.key;
		switch(keyName)
		{
			case 'Enter':
				nes.buttonUp(1, jsnes.Controller.BUTTON_START);
				break;
			case ' ':
				nes.buttonUp(1, jsnes.Controller.BUTTON_SELECT);
				break;
			case 'x':
				nes.buttonUp(1, jsnes.Controller.BUTTON_A);
				break;
			case 'w':
				nes.buttonUp(1, jsnes.Controller.BUTTON_B);
				break;
			case 'ArrowRight':
				nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
				break;
			case 'ArrowLeft':
				nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
				break;
			case 'ArrowDown':
				nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
				break;
			case 'ArrowUp':
				nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
				break;
		}
	});
}

setTimeout(Main, 0);