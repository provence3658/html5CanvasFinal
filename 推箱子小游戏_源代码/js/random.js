var msg = document.getElementById('msg'),
    paused = false,  // 初始按钮值
    lastTime = new Date,
    photo = -1,
    pps_photo = 50;      // 图片变化的pps

var spritesheet = new Image(); //传入数字组图
spritesheet.src = 'images/random.png';

var spriteCells = [
    {left:0, top: 0, width: 270, height: 240},
    {left:275, top: 0, width: 201, height: 240},
    {left:475, top: 0, width: 202, height: 240},
    {left:675, top: 0, width: 203, height: 240},
    {left:885, top: 0, width: 204, height: 240},
    {left:60, top: 240, width: 205, height: 240},
    {left:270, top: 240, width: 206, height: 240},
    {left:475, top: 240, width: 207, height: 240},
    {left:690, top: 240, width: 208, height: 240},
    {left:870, top: 240, width: 209, height: 240},
];

var spriteSheetPainter = new SpriteSheetPainter(spriteCells);

var runInPlace = {  
       lastAdvance: 0,  
       PAGEFLIP_INTERVAL: 10,  // 设定数字图的变化时间

       execute: function (sprite, context, time) {
          if (time - this.lastAdvance > this.PAGEFLIP_INTERVAL) {
            sprite.painter.advance();
            photo = (photo + 1) % 10;
            this.lastAdvance = time;
        }
    }
};

var runner = new Sprite('runner', spriteSheetPainter,[runInPlace]);
runner.left = 200;  
runner.top = 100;


function calculatePpf(pps, fps) {  //  计算ppf
    return Math.round(pps / fps);
}

function calculateFps(){   //  计算fps
    var now = new Date;
    fps = 1000 / (now - lastTime);
    fps = fps.toFixed(0);
    lastTime = now;
    return fps;
}

function pauseAnimation() {  // 按钮停止后的变化
    paused = true;
    context.font = '25px Microsoft YaHei';
    var guan = photo + (1 - firstAnimate);
    switch (guan) {
        case 0: 
            context.fillText('大吉大利，今晚吃鸡!', 200, 60);
            photo = 10;
            break;
        case 1:
            context.fillText('菜鸡来互啄吧!', 200, 60);
            break;
        case 2:
            context.fillText('今日诸事不宜!', 200, 60);
            break;
        case 9:
            context.fillText('你还真是厉害呢!', 200, 60);
            break;
        default:
            context.fillText('恭喜你跳到第'+ guan +'关!', 200, 60);
            break;
    }  
    setTimeout(thisLevel, 1500);
}

function thisLevel() {
    if(!audioLucky.paused) {
        audioLucky.pause();
        audioBg.play();
    }
    animateButton.style.display = 'none';
    if(chooseLevel[0].checked)
        iCurlevel = photo - firstAnimate % 2;
    else if(chooseLevel[1].checked)
        iCurlevel = photo - firstAnimate % 2 + 3;
    else
        iCurlevel = photo - firstAnimate % 2 + 6;
    initLevel(); //初始当前等级关卡
    moveTimes = 0; //移动步数清零
    showMoveInfo(); //显示当前关卡数据（初始化）
    if(firstAnimate == 1)
        firstAnimate = 0;
}
function drawFrame() {
    fps = calculateFps();
    if(!paused) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        now = new Date;
        ppf = calculatePpf(pps_photo, fps);
        runner.paint(context);
        runner.update(context, now);
    } 
}

function animate1() {
    drawFrame();
    requestAnimationFrame(animate1);
}