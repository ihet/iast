/**
 * Created by qxl on 2017/3/17.
 */
var MapBase = function(opts,data){
    this.data = [];
    this.tileWidth = null;
    this.tileHeight = null;
    this.wrapper = null;
    this.tw = 64;
    this.th = 32;
    this.mapWidth = 320;
    this.mapHeight = 160;
    this.init(opts,data);
};
MapBase.prototype = {
    convertData:function(data){
        var result = [];
        for(var i=0;i<data.length;i++){
            var x = i%this.tileWidth;
            var y = Math.floor(i/this.tileHeight);
            if(x==0){
                result.push([]);
            }
            result[y].push(data[i]);
        }
        return result;
    },
    init:function(opts,data){
        opts = opts ||{};
        this.tileWidth = opts.tileWidth;
        this.tileHeight = opts.tileHeight;
        this.wrapper = opts.wrapper || document.body;
        this.wrapper.style.width = this.tileWidth * this.tw+'px';
        this.wrapper.style.height = this.tileWidth * this.tw*0.5+'px';
        this.data = this.convertData(data);
        this.draw(this.data);
        
    },
    draw:function(data){
        var str = "";
        var origin = [this.mapWidth*0.5+0.5*this.tw,0];
        for(var y=0;y<data.length;y++){
            for(var x=0;x<data[y].length;x++){
                var classNames = data[y][x]?'tile disable':'tile';
                var top = x*this.th*0.5+y*this.th*0.5;
                var left = (x*0.5-0.5)*this.tw-0.5*(y+1)*this.tw+origin[0];
                str += '<div style="left:'+left+'px;top:'+top+'px;" class="'+classNames+'" data-Type ="'+data[y][x]+'">('+x+','+y+')</div>';
            }
        }
        this.wrapper.innerHTML = str;
    },
    clearPath:function(){
        
    },
    drawPath:function(path){
        for(var i in path){
           var num = path[i].x+path[i].y*this.tileWidth;
           this.wrapper.children[num].classList.add('red');
        }
    }
};