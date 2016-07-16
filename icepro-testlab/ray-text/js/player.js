function Player(x, y, direction) {
	this.x = x;
	this.y = y;
	this.direction = direction;
	this.weapon = new Bitmap('img/knife_hand.png', 319, 320);
	this.paces = 0;
}
function Bitmap(src, width, height) {
    this.image = new Image();
    this.image.src = src;
    this.width = width;
    this.height = height;
}