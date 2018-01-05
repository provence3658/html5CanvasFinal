var canvas = document.getElementById("mycanvas");
var context = canvas.getContext("2d");
var msg0 = document.getElementById("msg0");
var msg1 = document.getElementById("msg1");
var msg2 = document.getElementById("msg2");
var chooseLevels = document.getElementById("chooseLevels");
var chooseRoles = document.getElementById("chooseRoles");
var chooseLevel = document.getElementsByName("chooseLevel");
var chooseRole = document.getElementsByName("chooseRole");
var musicOnButton = document.getElementById("musicOnButton");
var audioBg = document.getElementById("audioBg");
var audioStart = document.getElementById("audioStart");
var audioSuccess = document.getElementById("audioSuccess");
var audioFail = document.getElementById("audioFail");
var audioLucky = document.getElementById("audioLucky");
var startButton1 = document.getElementById("startButton1");
var animateButton = document.getElementById("animate");
var homeButton = document.getElementById("home");
var returnstart = document.getElementById("return");
var Minsteps = [5, 13, 23, 34, 33, 29, 37, 66, 34, 45, 26, 33, 31, 34, 54, 75];//每关的最优步数
var w = 50, h = 50;
var flag = 0; // 音乐判断
var curMap; //当前的地图（每一步）
var curLevel; //当前等级的地图（每一关）
var curMan; //初始化小人
var iCurlevel = 0; //关卡数
var JB = 0; //金币
var moveTimes = 0; //移动了多少次
var jbk5 = document.getElementById("jbk5"); //金币减五
var replay = document.getElementById("replay"); //重玩
var next = document.getElementById("next");
var random = document.getElementById("random");//随机关卡
var fail = 0; //游戏结束标志
var levelFlag = 0; //等级标志
var firstAnimate = 1;
var keyboard = true;
var perPosition = new Point(1, 1); //小人的初始标值（值多少无所谓但一定要有）
//预加载所有图片
var oImgs = {
	"block": "images/ground.png",
	"wall": "images/wall.png",
	"box": "images/box1.png",
	"ball": "images/ball.png",
	"upgirl": "images/upgirl.png",
	"downgirl": "images/downgirl.png",
	"leftgirl": "images/leftgirl.png",
	"rightgirl": "images/rightgirl.png",
	"upboy": "images/upboy.png",
	"downboy": "images/downboy.png",
	"leftboy": "images/leftboy.png",
	"rightboy": "images/rightboy.png",
    "jb": "images/jb0.png",
    "diploma": "images/timg.jpg",
    "startBg": "images/background.png",
    "box1": "images/box.png",
    "yx": "images/yx.png",
    "rule": "images/rule.png",
}

// 规则
var ruleText = [
"1.	首先选择角色（男，女，默认为女）以及难度（simple，medium，",
"difficult，默认为simple）再开始游戏。" ,
"2.	通过键盘上的上下左右键可以控制小人的移动，当小人前有箱子且",
"箱子后不是箱子或墙时，小人可以将箱子向前移动一格，当小人将箱子",
"均推到蓝色的圆点上时，即为通过此关。" ,
"3. 系统会将你的步数与最优步数比较，然后判断几等奖。" ,         
"4.	每一关在地图上会出现金币，当小人走到该位置时玩家会得到该金",
"币，通过一个关卡（且为一等奖）时也会得到一个金币，两个金币可以",
"重玩此关，三个金币可随机抽取一关，五个金币可直接通过此关。" 
]

function imgPreload(srcs, callback) {
	var count = 0,
		imgNum = 0,
		images = {};

	for (src in srcs) {
		imgNum++;
	}

	for (src in srcs) {
		images[src] = new Image();
		images[src].onload = function() {
			//判断是否所有的图片都预加载完成
			if (++count >= imgNum) {
				callback(images);
			}
		}
		images[src].src = srcs[src];
	}
}

var block, wall, box, ball, up, down, left, right,
	jb, temp1, temp2, diploma, gameover, box1, yx, rule;

imgPreload(oImgs, function(images) {
	block = images.block;
	wall = images.wall;
	box = images.box;
	box1 = images.box1;
	ball = images.ball;
	jb = images.jb;
	yx = images.yx;
	rule = images.rule;
	temp1 = images.downboy;
	temp2 = images.downgirl;
	diploma = images.diploma;
	gameover = images.gameover;
	startBg = images.startBg;
	if(chooseRole[1].checked) {
		up = images.upboy;
		down = images.downboy;
		left = images.leftboy;
		right = images.rightboy;
	}
	else {
		up = images.upgirl;
		down = images.downgirl;
		left = images.leftgirl;
		right = images.rightgirl;
	}
	initBg();
});

//初始页面
function initBg() {
	context.drawImage(startBg, 0, 0, canvas.width, canvas.height);
	flag = 0;
	homeButton.style.display = 'none';
	ruleButton.style.display = 'block';
	startButton.style.display = 'block';
	homeButton.style.display = 'none';
	msg0.style.display = 'none';
	msg1.style.display = 'none';
	msg2.style.display = 'none';
}

//初始化游戏
function gamePg() {
	keyboard = true;
	flag = 1;
	if(chooseLevel[1].checked === true) { // medium
		iCurlevel = 3;
		levelFlag = 1;
	}
	else if(chooseLevel[2].checked === true) { // difficult
		iCurlevel = 6;
		levelFlag = 2;
	}
	else  // simple
		iCurlevel = 0;
	JB = 0;
	moveTimes = 0;
	initLevel(); //初始化对应等级的游戏
	showMoveInfo(); //显示对应等级的游戏数据（初始化）
}

function ruleBg() { // 规则显示
	context.drawImage(rule, 0, 200, rule.width * 0.75, rule.height * 0.75);
	for(var i = 0; i < 9; i++) {
		context.font = "18px Microsoft YaHei";
		context.fillText(ruleText[i], 20, 50 + 30 * i);
		startButton1.style.display = 'block';
	}
	
}
//绘制地板
function InitMap() {
	for (var i = 0; i < 16; i++) {
		for (var j = 0; j < 16; j++) {
			context.drawImage(block, w * j, h * i, w, h);
		}
	}
}

//小人位置坐标
function Point(x, y) {
	this.x = x;
	this.y = y;
}

//绘制每个游戏关卡地图
function DrawMap(level) {
	for (var i = 0; i < level.length; i++) {
		for (var j = 0; j < level[i].length; j++) {
			var pic = block; //初始图片
			switch (level[i][j]) {
				case 1: //绘制墙壁
					pic = wall;
					break;
				case 2: //绘制蓝色圆点
					pic = ball;
					break;
				case 3: //绘制箱子
					pic = box;
					break;
				case 4: //绘制小人
					pic = curMan; //小人有（上下左右）四个方向
					//获取小人的坐标位置
					perPosition.x = i;
					perPosition.y = j;
					break;
				case 5: //绘制蓝色箱子（即箱子已在目标点）
					pic = box1;
					break;
				case 6:
				    pic = jb; //绘制金币
				    break;
			}
			//每个图片不一样宽 （需要在对应地板的中心绘制地图）
			context.drawImage(pic, w * j - (pic.width - w) / 2, h * i - (pic.height - h), pic.width, pic.height);
		}
	}
}



//初始化游戏等级
function initLevel() {
	flag = 1;
	curMap = copyArray(levels[iCurlevel]); //当前移动过的游戏地图（每一步）
	curLevel = levels[iCurlevel]; //当前等级的初始地图（每一级）
	imgPreload(oImgs, function(images) {
		block = images.block;
		wall = images.wall;
		box = images.box;
		box1 = images.box1;
		ball = images.ball;
		jb = images.jb;
		yx = images.yx;
		rule = images.rule;
		temp1 = images.downboy;
		temp2 = images.downgirl;
		diploma = images.diploma;
		if(chooseRole[1].checked) {
			// console.log(1);
			up = images.upboy;
			down = images.downboy;
			left = images.leftboy;
			right = images.rightboy;
		}
		else {
			// console.log(2);
			up = images.upgirl;
			down = images.downgirl;
			left = images.leftgirl;
			right = images.rightgirl;
		}
	});

	//初始化小人
	if(chooseRole[1].checked)
		curMan = temp1; 
	else 
		curMan = temp2; 
	InitMap(); //初始化地板
	DrawMap(curMap); //绘制出当前等级的地图
}

//下一关
function NextLevel(i) {
	//iCurlevel当前的地图关数
	keyboard = true;
	iCurlevel = iCurlevel + i;
	if (iCurlevel < 0) {
		iCurlevel = 0;
		return;
	}
	var len = levels.length;
	if (iCurlevel > len - 1) {
		iCurlevel = len - 1;
	}
	initLevel(); //初始当前等级关卡
	moveTimes = 0; //移动步数清零
	showMoveInfo(); //显示当前关卡数据（初始化）
}

//小人移动
function go(dir) {
	var p1, p2, p3;
	switch (dir) {
		//获取小人运动方向前面的两个坐标来判断小人是否能够移动
		case "up":
			curMan = up;
			p1 = new Point(perPosition.x - 1, perPosition.y);
			p2 = new Point(perPosition.x - 2, perPosition.y);
			break;
		case "down":
			curMan = down;
			p1 = new Point(perPosition.x + 1, perPosition.y);
			p2 = new Point(perPosition.x + 2, perPosition.y);
			break;
		case "left":
			curMan = left;
			p1 = new Point(perPosition.x, perPosition.y - 1);
			p2 = new Point(perPosition.x, perPosition.y - 2);
			break;
		case "right":
			curMan = right;
			p1 = new Point(perPosition.x, perPosition.y + 1);
			p2 = new Point(perPosition.x, perPosition.y + 2);
			break;
	}

	if (Trygo(p1, p2)) {//若果小人能够移动的话，更新地图，游戏数据。
		moveTimes++;
		showMoveInfo();// 显示当前的游戏数据
	}
	//重画地图
	InitMap();
	DrawMap(curMap);

	if (checkFinish()) { // 检查是否通关
		// console.log(1);
		//alert(0);
		if(iCurlevel < 9 + 3 * levelFlag) {
			//游戏通关后效果
			keyboard = false;
			setTimeout("gameSuccess(moveTimes, Minsteps[iCurlevel])", 200); 
			// 延迟效果，为了最后一个箱子推到蓝色圆点上时也能显示出来
			// 玩家步数与最优步数比较
			// setTimeout("NextLevel(1)", 2000); 
		}
		else {			
			//如果背景音乐未关闭
			if(!audioBg.paused) {
				audioBg.pause();
				// audioSuccess.currentTime = 0;
				audioSuccess.play();// 全通关音乐
			}
			//游戏全部通关
			setTimeout(gameOver, 200);
		}
	}
}

//判断是否推成功
function checkFinish() {	
	for (var i = 0; i < curMap.length; i++) {
		for (var j = 0; j < curMap[i].length; j++) {
			//当前移动过的地图和当前等级原地图进行比较，如果原地图的蓝色圆点（蓝箱子）所在处不是蓝箱子则未成功。
			if (curLevel[i][j] == 2 && curMap[i][j] != 5 || curLevel[i][j] == 5 && curMap[i][j] != 5) {
					return false;
			}
		}
	}
	// 均比较过后无误则通过
	return true;
}

function gameSuccess(x, y) {  // 视玩家步数显示不同等级奖状
	keyboard = false;//此时按上向左右将不能走动，防止步数变化
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(diploma, 50, 70, 500, 358);
	context.font = "40px STKaiti";
	if(x <= y * 1.1) {
		context.fillText("一等奖", 240, 270);
		JB += 1;
	}
	else if(x <= y * 1.25){
		context.fillText("二等奖", 240, 270);
	}
	else
		context.fillText("三等奖", 240, 270);
	showMoveInfo();
}


function Trygo(p1, p2) {  //判断小人是否能够移动
	if (curMap[p1.x][p1.y] == 1) return false; //如果前面是墙则不通过
	if (curMap[p1.x][p1.y] == 3 || curMap[p1.x][p1.y] == 5) { //如果小人前面是箱子那就还需要判断箱子前面有没有障碍物(箱子/墙)
		if (curMap[p2.x][p2.y] == 1 || curMap[p2.x][p2.y] == 3 || curMap[p2.x][p2.y] == 5) {
			return false;
		}
		//如果能走小人前面的箱子前进一步
		else if(curMap[p2.x][p2.y] == 2) // 箱子前是球
			curMap[p2.x][p2.y] = 5;//箱子（有球）
		else
			curMap[p2.x][p2.y] = 3; //箱子（无球）
		//console.log(curMap[p2.x][p2.y]);
	}
	//如果都没返回则可以行走（小人前进一步）
	curMap[p1.x][p1.y] = 4; //更新小人位置

	//如果小人前进了一步以后，小人原来的位置如何显示
	var v = curLevel[perPosition.x][perPosition.y];//原始地图（每一关）的小人当前位置
	if(v == 6){ // 小人当前位置是金币
		levels[iCurlevel][perPosition.x][perPosition.y] = 0; //原始地图金币消失（重玩此关不再出现金币）
		curMap[perPosition.x][perPosition.y] = 0; // 变成墙
		JB ++;
	}
	if (v != 2) {// 如果小人当前位置不是蓝色小球	
		if (v == 5) {//如果小人当前位置是箱子（有球）		
			v = 2; //箱移走，球不被覆盖
		} 
		else {
			v = 0; 
		}
	}
	curMap[perPosition.x][perPosition.y] = v;// 更新地图数据
	perPosition = p1; //更新小人位置

	return true; //可以走
}


function doKeyDown(event) { // 键盘响应
	if(keyboard === true) {
		switch (event.keyCode) {
			case 37: //左
				go("left");
				break;
			case 38: //上
				go("up");
				break;
			case 39: //右
				go("right");
				break;
			case 40: //下
				go("down");
				break;
		}
	}
}

//完善关卡数据及游戏说明
function showMoveInfo() {  // 显示当前数据
	msg0.innerHTML = "金币数" + (JB);
	if(levelFlag == 1) {
		msg1.innerHTML = "第" + (iCurlevel+1-3) +"关";
	}
	else if(levelFlag == 2) {
		msg1.innerHTML = "第" + (iCurlevel+1-6) +"关";
	}
	else
		msg1.innerHTML = "第" + (iCurlevel+1) +"关";
	msg2.innerHTML = "移动"+ (moveTimes) +"步";
}


var step_y = 3, y = 0, fps, lastTime;

function gameOver() {
	flag = 2;//游戏结束音乐的标志
	keyboard = false;
	y = 0;
	context.clearRect(0, 0, canvas.width, canvas.height);
	animateFrame = requestAnimationFrame(animate);
}

function animate() {
	y += step_y;
	drawImage(y);
	if(y > 550) {
		// console.log(1);
		cancelAnimationFrame(animateFrame);
		homeButton.style.display = 'block';
	}
	else {
		calculate();
		requestAnimationFrame(animate);
	}
}

function calculate() { // 计算fps
	var now = new Date;
	fps = 1000 / (now - lastTime);
	fps = fps.toFixed(0);
	lastTime = now;
	return fps;
}

function drawImage(y) {  // 游戏结束（失败及全通关）标志
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(box, 20, y, box.width, box.height);
	context.drawImage(box, 120, y, box.width, box.height);
	context.drawImage(box, 220, y, box.width, box.height);
	context.drawImage(box, 320, y, box.width, box.height);
	context.drawImage(box, 420, y, box.width, box.height);
	context.drawImage(box, 520, y, box.width, box.height);
	context.drawImage(box, 20, y - 540, box.width, box.height);
	context.drawImage(box, 120, y - 540, box.width, box.height);
	context.drawImage(box, 220, y - 540, box.width, box.height);
	context.drawImage(box, 320, y - 540, box.width, box.height);
	context.drawImage(box, 420, y - 540, box.width, box.height);
	context.drawImage(box, 520, y - 540, box.width, box.height);
	context.drawImage(yx, 60, y - 460, 480, 480);
}

//克隆二维数组
function copyArray(arr) {
	var b = []; //定义数组
	for (var i = 0; i < arr.length; i++) {
		b[i] = arr[i].concat(); //链接两个数组
	}
	return b;
}
