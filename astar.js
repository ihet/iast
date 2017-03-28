/**
 * Created by qxl on 2017/3/17.
 */
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}
var Astar = function(start,target,mapData){
    var _self = this;
    this.start  = start;
    this.target = target;
    this.mapData = [];
    this.tileWidth = mapData.tileWidth;
    this.tileHeight = mapData.tileHeight;
    this.open = [];
    this.close = [];
    this.initMap(mapData) ;
    this.init();
};
Astar.prototype = {
    init:function(){
        console.dir(this._getDist(this.start,this.target));
    },
    initMap:function(mapData){
        var result= [];
        for(var i=0;i<data.length;i++){
            var x = i%mapData.tileWidth;
            var y = Math.floor(i/mapData.tileHeight);
            if(x==0){
                result.push([]);
            }
            var node = {value:mapData.data[y][x]};
            result[y].push(node);
        }
        this.mapData = result;
    },
    compute:function(){
        var _self = this;
        //设置初始open列表
        var foot = 0;
        var parentPoint = null;
        var currentPoint = null;
        var result = null;
        _self.start.foot = 0;
        _self._setOpen(_self.start,foot);
        while (_self.open.length){
            //取出f值最小的值，设置为当前点
            _self.open.sort(function (a,b) {
                var ga = _self._getF(foot,a);
                var gb = _self._getF(foot,b);
                return ga - gb;
            });
            //将该点放入close列表，并从open列表删除
            _self.close.push(_self.open.shift());
            foot+=1;
            parentPoint = currentPoint;
            currentPoint = _self.close[_self.close.length-1];
            if(currentPoint.x == _self.target.x && currentPoint.y == _self.target.y){
                result = currentPoint;
                break;
            }
            _self._setOpen(currentPoint,foot);
        }
        //输出路径
        var path = [];
        var getPath = function(point){
            if(!point) return;
            path.push({x:point.x,y:point.y});
            getPath(point.parent);
        };
        getPath(result);
        return path;
    },
    //将节点四周设置到open列表中
    _setOpen:function(point){
        var _self = this;
        var foot = point.foot+1;
        var openlist = [];
        openlist[0] = {x:point.x,y:point.y-1};
        openlist[1] = {x:point.x,y:point.y+1};
        openlist[2] = {x:point.x-1,y:point.y};
        openlist[3] = {x:point.x+1,y:point.y};
        for(var i=0;i<openlist.length;i++){
            var item = openlist[i];
            if(item.x<0 || item.y<0 || item.x>=_self.tileWidth || item.y>=_self.tileHeight){
                continue
            }
            if(!_self.canPass(item) || _self.isInList(item,_self.close)) {
                continue;
            }
            var pindex = _self.isInList(item,_self.open);
            if(pindex){
                if(_self.open[pindex].g > foot){
                    _self.open[pindex].g = foot;
                    _self.open[pindex].parent = point;
                }
            }
            else{
                _self.open.push({x:item.x,y:item.y,parent:point,g:foot});
            }
        }
    },
    canPass:function(point){
        return !this.mapData[point.y][point.x].value;
    },
    //取得估值函数f=g+h的值
    _getF:function(foot,point){
        var h = this._getDist(point,this.target);
        return foot + h;
    },
    //取得点和目标点之间的距离
    _getDist:function(pointA,pointB){
        return Math.abs(pointA.x-pointB.x)+Math.abs(pointA.y-pointB.y);
    },
    //判断点是否在列表中
    isInList:function(point,list){
        for(var i in list){
            if(list[i].x == point.x && list[i].y == point.y){
                return i;
            }
        }
        return null;
    }
};