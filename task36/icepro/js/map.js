//map类
(function($, square) {
    class map {
        constructor(size) {
            this.size = size;
            this.walls = Array(size * size);
        }
        beyondWord(x, y) {
                if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return true;
                return false;
            }
            //true 没墙，false 有墙
        haveWall(x, y) {
            if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return false;
            return this.walls[this.size * y + x] ? false : true;
        }

        getWall(x, y) {
            if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return undefined;
            return this.walls[this.size * y + x];
        }
        buildWall(x, y, color) {
            this.walls[this.size * y + x] = color ? color : undefined;
        }
        findWay(x, y, px, py) {
            // console.log("x");
            let star_A = new star_a(parseInt(x), parseInt(y), parseInt(px), parseInt(py), this);
            return star_A.find();
        }
    }
    square.prototype.map = map;
    class star_a {
        constructor(x, y, px, py, map) {
            this.map = map;
            this.x = parseInt(x);
            this.y = parseInt(y);
            this.px = parseInt(px);
            this.py = parseInt(py);
            this.open = [];
            this.close = [];
            this.opened = [];
        }
        find() {
            var wall = this.walls;
            var self = this;
            this.open.push(new pos(null, this.x, this.y, this.px, this.py));
            // this.addPos(this.open[0]);
            var result;
            loop1:
                while (!result) {
                    let target, index, min = 999999;
                    //首先寻找self open中f最小的
                    for (var i in self.open) {
                        if (min > self.open[i].F) {
                            min = self.open[i].F;
                            index = parseInt(i);
                        }
                    }
                    // addPos(target);
                    for (let i in self.open) {
                        //获取open的map位置，若位置和目标相同则返回
                        if (self.open[i].dis(self.map.size) == (self.map.size * self.py + self.px)) {
                            result = self.open[i];
                            break loop1;
                        }
                    }
                    //添加周围的点
                    self.addPos(self.open[index]);
                    //如果已经被打开的
                    // if (self.opened.indexOf(self.open[index].dis(self.map.size)) < 0) self.opened.push(self.open[index].dis(self.map.size));
                    //在关闭中添加本身
                    self.close.push(self.map.size * self.open[index].y + self.open[index].x);
                    self.open.splice(index, 1);
                    if (self.open.length < 1 || self.open.length > 999) break loop1;
                }
            return result;
        }
        addPos(position) {
            var self = this;

            function add(x, y) {
            	//在close中寻找是否有一个节点
                if ((self.close.indexOf(self.map.size * y + x) < 0)) {
                	//没墙把它加进去
                    if (self.map.haveWall(x, y)) {
                        self.open.push(new pos(this, x, y, self.px, self.py));
                    } else {
                        self.close.push(self.map.size * y + x);
                    }
                }
            }
            add.call(position, position.x - 1, position.y);
            add.call(position, position.x + 1, position.y);
            add.call(position, position.x, position.y - 1);
            add.call(position, position.x, position.y + 1);
        }
    }
    class pos {
        constructor(posLast, x, y, px, py) {
            this.posLast = posLast;
            this.x = parseInt(x);
            this.y = parseInt(y);
            this.px = parseInt(px);
            this.py = parseInt(py);
        }
        get F() {
            return this.G + this.H;
        }
        get G() {
            if (!this.posLast) return 0;
            return this.posLast.G + 1;
        }
        get H() {
            return (Math.abs(this.px - this.x) + Math.abs(this.py - this.y));
        }
        dis(size) {
            return size * this.y + this.x;
        }
        get delatx() {
            return this.posLast ? parseInt(this.x) - parseInt(this.posLast.x) : 0;
        }
        get delaty() {
            return this.posLast ? parseInt(this.y) - parseInt(this.posLast.y) : 0;
        }
    }
})($, square);