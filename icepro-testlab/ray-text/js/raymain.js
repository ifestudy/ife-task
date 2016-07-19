function GameLoop() {
	this.frame = this.frame.bind(this);
	this.lastTime = 0;
	this.callback = function() {};
}
GameLoop.prototype.start = function(callback) {
	this.callback = callback;
	requestAnimationFrame(this.frame);
};
GameLoop.prototype.frame = function(time) {
	var seconds = (time - this.lastTime) / 1000;
	this.lastTime = time;
	if (seconds < 0.2) this.callback(seconds);
	requestAnimationFrame(this.frame);
};
var display = document.getElementById('display');
var player = new Player(0, 0, Math.PI * 0.3);
var map = new Map(32);
var camera = new Camera(display, 150, 0.8);
var loop = new GameLoop();
map.randomize();

