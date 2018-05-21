window.onload = function(){
    var speed=1;

    var box = document.getElementById("box");
    var vdo = document.getElementById("vdo");
    var playImg = document.getElementById("playImg");
    var playRange = document.getElementById("playRange");
    var muted = document.getElementById("muted");
    var volRange = document.getElementById("volRange");
    var fullscreen = document.getElementById("fullscreen");
    var currentTime = document.getElementById("currentTime");
    var allTime = document.getElementById("allTime");
    var speedbtn = document.getElementById("speed");
    var file = document.getElementById("file");
    var path = document.getElementById("path");
    var ff = document.getElementById("ff");

    //默认音量
    var volume = 1;
    
    var allTimes = 0;
    //获取屏幕的宽高
    var sw = window.screen.width;
    var sh = window.screen.height;
    // var vw = vdo.offsetWidth;
    // var vh = vdo.offsetHeight;
    var vw = 1000;
    var vh = 570;
    box.style.width = vw +"px";
    box.style.height = vh + "px";
    vdo.style.width = vw +"px";
    vdo.style.height = vh + "px";
    //控制播放速度
    vdo.playbackRate = speed;
    for (var i = 0; i < speedbtn.children.length; i++) {
        (function (i) {
            speedbtn.children[i].onclick=function() {
                speed=this.value;
            }
        })(i)
    }
    //设置一个本地储存项
//			localStorage.setItem("playTime",0);
    if(localStorage.getItem("playTime")){
        playRange.setAttribute("max",Math.ceil(localStorage.getItem("allTimes")))
        allTime.innerHTML = getTimes(localStorage.getItem("allTimes"));
        //改变滑块
        playRange.value = Math.floor(localStorage.getItem("playTime"));
        vdo.currentTime = localStorage.getItem("playTime");
    }
    //读取文件路径
    if(localStorage.getItem("filePath")){
        path.value = localStorage.getItem("filePath");
    }
    if(localStorage.getItem("fileName")){
        vdo.src = localStorage.getItem("fileName");
    }
    //播放与暂停功能
    var isPlay = true;
    //是否静音
    var isMuted = true;
    //全屏开关
    var isFull = true;
    //开关视频
    playImg.onclick = playOrPause;
    function playOrPause(){
        
        volume = vdo.volume;
        //设置默认音量
        volRange.value = volume*10;
        allTimes = vdo.duration;
        localStorage.setItem("allTimes",allTimes);
        //设置滑块总时长
        playRange.setAttribute("max",Math.ceil(allTimes))
        var duration = getTimes(allTimes);
        allTime.innerHTML = duration;
//				console.log(document.getElementsByTagName("video")[0].duration)
//				console.log(video.isp)
        if(isPlay){
            vdo.play();
            playImg.src = "img/play.png";
            isPlay = false;
        }else{
            vdo.pause();
            playImg.src = "img/pause.png";
            isPlay = true;
        }
    }
    
    //监听视频的播放
    vdo.addEventListener("timeupdate",playTime,true);
    function playTime(){
        vdo.playbackRate = speed;
        //vdo.currentTime获取视频播放时间
        var currentTimes = vdo.currentTime;
        localStorage.setItem("playTime",currentTimes);
        //改变滑块
        playRange.value = Math.floor(currentTimes);
        var curTime = getTimes(currentTimes);
        currentTime.innerHTML = curTime;
        
        //如果播放完毕，则需要更改播放按钮状态---重置操作
        if(currentTimes == allTimes){
            playImg.src = "img/pause.png";
            isPlay = true;
            playRange.value = 0;
            currentTime.innerHTML = "00:00";
        }
    }
    
    playRange.onchange = playRangeChange;
    
    function playRangeChange(){
        var val = this.value;
        vdo.currentTime = val;
    }
    
    muted.onclick = mutedFn;
    /**
     * 是否静音
     */
    function mutedFn(){
        if(isMuted){
            vdo.volume = 0;
            muted.src = "img/novol.png";
            isMuted = false;
        }else{
            vdo.volume = volume;
            muted.src = "img/vol.png";
            isMuted = true;
        }
    }
    
    //音量改变
    volRange.onchange = volChange;
    
    function volChange(){
        var val = this.value;
        vdo.volume = val/10;
        volume = val/10;
        
        if(val == 0){
            vdo.volume = 0;
            volume = 0;
            muted.src = "img/novol.png";
            isMuted = false;
        }else{
            vdo.volume = volume;
            muted.src = "img/vol.png";
            isMuted = true;
        }
    }
    //全屏设置
    fullscreen.onclick = setFullFn;
    
    function setFullFn(){
        if(isFull){
            box.webkitRequestFullScreen();
            box.style.width = sw + "px";
            box.style.height = sh + "px";
            vdo.style.width = sw + "px";
            vdo.style.height = sh + "px";
            isFull = false;
        }else{
            document.webkitCancelFullScreen();
            box.style.width = vw + "px";
            box.style.height = vh + "px";
            vdo.style.width = vw + "px";
            vdo.style.height = vh + "px";
            isFull = true;
        }
    }
    ff.onclick=addFile;
    function addFile() {
        var p=path.value;
        localStorage.setItem("filePath",p);
        var f=file.files[0]["name"];
        var pf=p+"\\"+f;
        localStorage.setItem("fileName",pf);
        vdo.src=pf;
        vw = vdo.offsetWidth;
        vh = vdo.offsetHeight;
        playImg.src = "img/pause.png";
        isPlay = true;
    }
    //快进--快退
    //临界值判断
    // vdo.currentTime += 5
    
    /**
     * 传入参数，得到时间
     * @param {Number} time
     */
    function getTimes(time){
        var h = parseInt(time/3600);
        var m = parseInt((time - h*3600)/60);
        var s = Math.ceil(time - h*3600 - m*60);
        h = h==0 ? "" : "0"+ h +":";
        m = m<10 ? "0"+m+":" : m+":";
        s = s < 10 ? "0"+ s:s;
        return h + m + s;
    }
//			video.play()
}