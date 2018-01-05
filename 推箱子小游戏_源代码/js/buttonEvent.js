ruleButton.onclick = function(e) { // 规则按钮效果
	context.clearRect(0, 0, canvas.width, canvas.height);
	ruleButton.style.display = 'none';
	startButton.style.display = 'none';
	ruleBg();
}

startButton.onclick = function(e) { // 开始按钮效果
	context.clearRect(0, 0, canvas.width, canvas.height);
	ruleButton.style.display = 'none';
	startButton.style.display = 'none';
	gamePg(); // 游戏开始
	msg0.style.display = 'block';
	msg1.style.display = 'block';
	msg2.style.display = 'block';
	if(!audioStart.paused) { // 如果没关音乐
		audioStart.pause();
		audioBg.currentTime = 0;
		audioBg.play();
	}
}

chooseLevels.onchange = function (e) {  // 选择难度
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
}

musicOnButton.onclick = function (e) {  // 音乐按钮
	if(flag == 1) {
		if(audioBg.paused) {
			musicOnButton.style.background = "url(images/music-on.png) no-repeat";
			audioBg.play();
		}
		else {
			musicOnButton.style.background = "url(images/music-off.png) no-repeat";
			audioBg.pause();
		}
	}
	else if(flag == 0) {
		if(audioStart.paused) {
			musicOnButton.style.background = "url(images/music-on.png) no-repeat";
			audioStart.play();
		}
		else {
			musicOnButton.style.background = "url(images/music-off.png) no-repeat";
			audioStart.pause();
		}
	}
	else if(flag == 2){
		if(audioSuccess.paused) {
			musicOnButton.style.background = "url(images/music-on.png) no-repeat";
			audioSuccess.play();
		}
		else {
			musicOnButton.style.background = "url(images/music-off.png) no-repeat";
			audioSuccess.pause();
		}
	}
	else if(flag == 3){
		if(audioFail.paused) {
			musicOnButton.style.background = "url(images/music-on.png) no-repeat";
			audioFail.play();
		}
		else {
			musicOnButton.style.background = "url(images/music-off.png) no-repeat";
			audioFail.pause();
		}
	}
	else {
		if(audioLucky.paused) {
			musicOnButton.style.background = "url(images/music-on.png) no-repeat";
			audioLucky.play();
		}
		else {
			musicOnButton.style.background = "url(images/music-off.png) no-repeat";
			audioLucky.pause();
		}
	}
}
jbk5.onclick = function(e) { // 金币扣5
	if(JB >= 5) {
		JB -= 5;
		showMoveInfo();
		if(iCurlevel == 9 + 3 * levelFlag) {// 如果要跳过的是最后一关
			if(!audioBg.paused) {
				audioBg.pause();
				audioSuccess.play();// 全通关音乐
			}
			setTimeout(gameOver, 200);
		}
		else
			NextLevel(1);
	}
	else 
		alert("大哥你还是先吃点金币吧");
}

replay.onclick = function(e) { // 重玩按钮
	if(JB >= 2) {// 如果金币够2个
		JB -= 2;
		showMoveInfo();
		NextLevel(0);		
	}
	else 
		alert("大哥你还是先吃点金币吧");
}

next.onclick = function(e) { // 下一关按钮
	if(checkFinish()) {// 检查是不是通关
		NextLevel(1);
		keyboard = true;
	}
	else
		alert("大哥你还没通关呢/微笑"); // 彩蛋
}

animateButton.onclick = function (e) {   //  暂停
   	pauseAnimation();	
};

random.onclick = function(e) {
	if(JB >= 3) {
		flag = 4;
		if(!audioBg.paused) {
			audioBg.pause();
			audioLucky.currentTime = 0;
			audioLucky.play();// 全通关音乐
		}
		JB -= 3;
		paused = false;
		context.clearRect(0, 0, canvas.width, canvas.height);
		animateButton.style.display = "block";
		animate1();
		showMoveInfo();
	}
	else
   		alert("大哥你还是先吃点金币吧");
}

//游戏规则中的开始按钮
startButton1.onclick = function() { // 游戏开始按钮
	context.clearRect(0, 0, canvas.width, canvas.height);
	startButton1.style.display = 'none';
	msg0.style.display = 'block';
	msg1.style.display = 'block';
	msg2.style.display = 'block';
	gamePg();
	if(!audioStart.paused) {
		audioStart.pause();
		audioBg.play();
	}
}

homeButton.onclick = function() {
	initBg();
	if(!audioSuccess.paused) {
		audioSuccess.pause();
		audioStart.currentTime = 0;
		audioStart.play();
	}
	if(!audioBg.paused) {
		audioBg.pause();
		audioStart.currentTime = 0;
		audioStart.play();
	}
	if(!audioFail.paused) {
		audioFail.pause();
		audioStart.currentTime = 0;
		audioStart.play();
	}
}

returnstart.onclick = function(e) {
	flag = 3;
	if(!audioBg.paused) {
		audioBg.pause();
		audioFail.currentTime = 0;
		audioFail.play();
	}
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = "25px Microsoft YaHei";
	context.fillText("我就不嘲笑你这个傻子了哈哈哈", 100, 150);
	context.fillText("此处省略100000000个哈哈哈", 100, 250);
	context.fillText("别愣着呀快点下面的按钮", 100, 350);
	homeButton.style.display = 'block';
}