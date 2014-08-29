var Brick = (function(){
    var BRICKS = [
            [
                [
                    ['_','*','_'],
                    ['*','*','*']
                ],
                [
                    ['_','*'],
                    ['*','*'],
                    ['_','*']
                ],
                [
                    ['*','*','*'],
                    ['_','*','_']
                ],
                [
                    ['*','_'],
                    ['*','*'],
                    ['*','_']
                ]
            ],
            [
                [
                    ['*','*','*','*'],
                ],
                [
                    ['*'],
                    ['*'],
                    ['*'],
                    ['*']
                ]
            ],
            [
                [
                    ['*','*'],
                    ['*','*']
                ]
            ],
            [
                [
                    ['*','*','_'],
                    ['_','*','*']
                ],
                [
                    ['_','*'],
                    ['*','*'],
                    ['*','_']
                ]
            ],
            [
                [
                    ['_','*','*'],
                    ['*','*','_']
                ],
                [
                    ['*','_'],
                    ['*','*'],
                    ['_','*']
                ]
            ],
            [
                [
                    ['*','*','*'],
                    ['*','_','_']
                ],
                [
                    ['*','*'],
                    ['_','*'],
                    ['_','*']
                ],
                [
                    ['_','_','*'],
                    ['*','*','*']
                ],
                [
                    ['*','_'],
                    ['*','_'],
                    ['*','*']
                ]
            ],
            [
                [
                    ['*','_','_'],
                    ['*','*','*']
                ],
                [
                    ['*','*'],
                    ['*','_'],
                    ['*','_']
                ],
                [
                    ['*','*','*'],
                    ['_','_','*']
                ],
                [
                    ['_','*'],
                    ['_','*'],
                    ['*','*']
                ]
            ]
        ];

    function Shape(shapes){
        this.current = 0;
        this.shape = shapes[this.current];
        this.shapes = shapes;
    }

    Shape.prototype = {
        toString: function(){
            var shapeLines = this.shape.length,
                result = '';
            while(shapeLines--){
                result += this.shape[shapeLines].join('') + "\n";
            }
            return result;
        },
        rotate: function(){
            this.shape = this.shapes[++this.current%this.shapes.length];
        }
    };

    function Brick(map){
        this.x = 0;
        this.y = 0;
        this.shape = new Shape(BRICKS[parseInt(Math.random()*BRICKS.length,10)]);
        this.map = map;
    }

    Brick.prototype = {
        left: function(){
            if(this.map.isPossible(this.shape.shape, this.x - 1, this.y)){
                this.x--;
                return true;
            }
            return false;
        },
        right: function(){
            if(this.map.isPossible(this.shape.shape, this.x + 1, this.y)){
                this.x++;
                return true;
            }
            return false;
        },
        rotate: function(){
            var tmpShape = new Shape(this.shape.shape);
            tmpShape.rotate();
            if(this.map.isPossible(tmpShape.shape, this.x, this.y)){
                this.shape.rotate();
                return true;
            }
            return false;
        },
        down: function(){
            if(this.map.isPossible(this.shape.shape, this.x, this.y + 1)){
                this.y++;
                return true;
            }
            return false;
        }
    };

    return Brick;
}());

var Map = function(width, height){
    var i,j;
    this.width = width;
    this.height = height;
    this.map = [];
    for(i=0;i<this.height;i++){
        this.map[i] = [];
        for(j=0;j<this.width;j++){
            this.map[i][j] = '.';
        }
    }
    this.emptyLine = _.clone(this.map[0]);
}

Map.prototype = {
    isPossible: function(shape, x, y){
        var i,
            j,
            hB = shape.length,
            wB = shape[0].length;

        if(shape.length + y > this.height) {
            return false;
        }

        for(i = y;i < y + hB; i++){
            for(j = x;j < x + wB; j++){
                if(shape[i-y][j-x] === '*' && this.map[i][j] !== '.'){
                    return false;
                }
            }
        }

        return true;
    },
    addBrick: function(brick){
        var i,
            j,
            hB = brick.shape.shape.length,
            wB = brick.shape.shape[0].length;

        for(i = brick.y;i < brick.y + hB; i++){
            for(j = brick.x;j < brick.x + wB; j++){
                if(brick.shape.shape[i-brick.y][j-brick.x] === '*'){
                    this.map[i][j] = '*';
                }
            }
        }
    },
    checkFullLines: function(){
        var score = 0, i, fullLine;

        for(i = 0; i<this.height; i++){
            if(this.map[i].join('').indexOf('.') === -1){
                score += 100;
                this.map.splice(i,1);
                this.map.unshift(this.emptyLine);
            }
        }

        return score;
    },
    isFull: function(){
        var i = this.width;
        while(i--){
            if(this.map[0][i] === '*'){
                return true;
            }
        }
        return false;
    },
    draw: function(currentBrick){
        var result = '',
            i = 0,
            j = 0,
            hB,
            wB,
            tmpMap = [];

        for(i=0;i<this.height;i++){
            tmpMap[i] = _.clone(this.map[i]);
        }

        if(currentBrick){
            hB = currentBrick.shape.shape.length;
            wB = currentBrick.shape.shape[0].length;
            for(i = currentBrick.y;i < currentBrick.y + hB; i++){
                for(j = currentBrick.x;j < currentBrick.x + wB; j++){
                    if(currentBrick.shape.shape[i-currentBrick.y][j-currentBrick.x] === '*'){
                        tmpMap[i][j] = '*';
                    }
                }
            }
        }

        for(i = 0;i < this.height;i++){
            result += tmpMap[i].join('') + "\n";
        }
        return result;
    }
};

var Tetris = function(container){
    var that = this;

    this.container = container;
    this.interval = 1000;
    this.map = new Map(10, 20);
    this.paused = true;
    this.score = 0;
    this.currentBrick = new Brick(this.map);

    window.document.onkeydown = function(e){
        if(!that.paused){
            if(e.keyCode === 32) {
                that.currentBrick.rotate();
            }
            if(e.keyCode === 37) {
                that.currentBrick.left();
            }
            if(e.keyCode === 39) {
                that.currentBrick.right();
            }
            if(e.keyCode === 40) {
                that.currentBrick.down();
            }
            console.log(that.map.draw(that.currentBrick));
        }
    }
};

Tetris.prototype = (function(){
    return {
        start: function(){
            var that = this;
            this.paused = false;
            this.mainInterval = window.setInterval(function(){
                if(!that.paused){
                    if(!that.currentBrick.down()){
                        that.map.addBrick(that.currentBrick);
                        that.score += that.map.checkFullLines();
                        if(that.map.isFull()){
                            that.stop();
                            console.log('YOU LOSER!!!');
                            console.log('Your score was ' + that.score);
                        } else {
                            that.currentBrick = new Brick(that.map);
                        }
                    }
                    console.log(that.map.draw(that.currentBrick));
                }
            }, this.interval);
        },
        pause: function(){
            this.paused = true;
        },
        stop: function(){
            this.paused = true;
            window.clearInterval(this.mainInterval);
        }
    };
}());
