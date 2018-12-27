import enableInlineVideo from "iphone-inline-video";

class mvideo {
    constructor(opts = {}) {
        this.mp4 = opts.mp4;
        this.ele = opts.ele;
        this.controlConfig = opts.controlConfig || [];
        this.currentPointId = 0;
        this._init();
    }

    _init () {
        this._setVideo();
    }

    _setVideo () {
        this.player = document.createElement("video");
        this.player.setAttribute("playsinline", "true");
        this.player.setAttribute("webkit-playsinline", "true");
        this.player.setAttribute("x-webkit-airplay", "allow");
        this.player.setAttribute("x5-video-player-type", "h5");
        this.player.setAttribute("x5-video-player-fullscreen", "true");
        this.player.setAttribute("x5-video-orientation", "portraint");
        this.player.poster = "http://app.fansiji.com/h5/wyklhw2/images/index.jpg?Sdfds";
        this.player.src = this.mp4;
        this.player.preload = "preload";
        this.player.controls = false;
        this.player.style.width = "100%";
        this.player.style.height = "100%";
        this.player.style.objectFit = "cover";
        this.player.style.backgroundSize = "100% 100%";
        document.querySelector(this.ele).appendChild(this.player);
        this.isVid = true;
        this._addCss();
        if (this._isIos()) {
            enableInlineVideo(this.player);
        }
    }

    _addCss () {
        var style = document.createElement("style");
        style.innerHTML = ".IIV::-webkit-media-controls-play-button,.IIV::-webkit-media-controls-start-playback-button {opacity: 0;pointer-events: none;width: 5px;}";
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    _isIos () {
        var u = navigator.userAgent;
        if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            return true;
        }
        else {
            return false;
        }
    }

    _isInWX () {
        var ua = navigator.userAgent.toLowerCase();
        var t = ua.match(/MicroMessenger/i) + "";
        if (t == "micromessenger") {
            return true;
        }
        else {
            return false;
        }
    }

    // 跳转到某时间
    seek (t) {
        this.player.currentTime = t;
    }

    _remove (el) {
        el.parentNode.removeChild(el);
    }

    // 销毁
    destroy () {
        this.player.muted;
        this.player.pause();
        this._remove(this.player);
    }

    // 视频播放
    play () {
        this.player.play();
        if(Object.prototype.toString.call(this.controlConfig) === '[object Array]' && this.controlConfig.length > 0) {
            this.enterFrame();
        }
    }

    // 视频暂停
    pause () {
        this.player.pause();
    }

    // 是否静音；true为静音，false为不静音
    mute (bool) {
        if (bool) {
            this.player.muted = true;
        }
        else {

            this.player.muted = false;

        }
    }

    enterFrame () {  
        var currentTime = this.player.currentTime.toFixed(1);

        requestAnimationFrame(this.enterFrame.bind(this));
        if (this.currentPointId < this.controlConfig.length) {
            if (parseFloat(currentTime) == this.controlConfig[this.currentPointId].time) {
                this.controlConfig[this.currentPointId].handle();
                this.currentPointId++;
            }
        }
    }

    stopFrame () {
        cancelAnimationFrame(this.enterFrame.bind(this));
    }
}

export default mvideo