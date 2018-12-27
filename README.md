# H5视频播放解决方案

文章主要讲一下几个关键点

**一、视频内联播放** 想要营造一种文字与视频混排的现象，视频不要影响其他模块

**二、视频去控件** 交互视频，不能点击快/慢进或暂停哦

**三、去控件全屏播放** 想要模拟 明星给我打电话的体验，不能看到明显的视频播放器

**四、视频自动播放** 想要释放用户操作，打开链接就自动播放

**五、黑屏问题** 开始播放时，有一段黑屏时间，不能无缝衔接

**六、其他属性和方法** 喜欢一个技术，就要了解“她”的全部，这些你也看看呗

## 一、video 标签内联播放

Video 标签内联播放，需要添加属性：

```js
webkit-playsinline="true" playsinline=“true”
```

 而在 iphone上 默认是全屏播放的。

需要在 Obj-C 里，webview设置allowsInlineMediaPlayback属性为

```js
YESwebview.allowsInlineMediaPlayback = YES;
```

这个需要客户端的同学注意一下。

iOS 10 之前的版本支持 webkit-playsinline，但是加了这个属性后，在 iOS 9 上出现只能听到声音不能看到画面的问题。

为了 兼容ios8、9 需要再加上这个库 [iphone-inline-video](https://github.com/bfred-it/iphone-inline-video) 一起使用。

备注：ios下在微博中打开网页播放视频会弹出播放器播放，设置playsinline属性无效，还必须使用上面那个插件，亲测有效。

这里补充一下 iphone-inline-video 使用方法：

1. npm install –save iphone-inline-video
2. 使用

```html
<video src='file.mp4' playsinline> 不支持 video 标签显示</vide>
```

```js
var enableInlineVideo = require('iphone-inline-video');
var video = document.querySelector('video');
enableInlineVideo(video);
video.addEventListener('touchstart', function () {
    video.play();
});
```

*iphone-inline-video在iOS 10上会自动禁用。*

*确保你使用这个playsinline属性。*

## 二、播放视频去控件

非全屏下去掉控件可添加CSS:

```css
.IIV::-webkit-media-controls-play-button,
.IIV::-webkit-media-controls-start-playback-button {
  opacity: 0;
  pointer-events: none;
  width: 5px;
}
```

## 三、去控件全屏播放

实现去控件全屏播放步骤：

1、全屏实现：将video视频宽高设置为 100% （全屏），如果发现视频还是不行那么就需要根据实际情况设置 object-fit属性来解决了。 详见 [半深入理解CSS3 object-position/object-fit属性](http://link.zhihu.com/?target=http%3A//www.zhangxinxu.com/wordpress/2015/03/css3-object-position-object-fit/)

备注：在webkit内核浏览器下，默认是object-fit:contain。

2、去控件参照上面说的第二步

当然，如果想要实现真正的全屏（顶部的导航消失），针对x5内核的可以使用同层播放器。

新版的 TBS 内核（>=036849）支持同层播放器的视频播放器，且不需要申请白名单。

只需给 video 设置以下属性即可

```js
x5-video-player-type="h5"  // 可以开启同层播放器，来避免播放后显示推荐视频的问题。
x5-video-player-fullscreen="true" // 视频全屏播放
x5-video-orientation="portrait"// 视频竖屏模式播放
```

- 建议看[官网文档](https://link.juejin.im/?target=https%3A%2F%2Fx5.tencent.com%2Ftbs%2Fguide%2Fvideo.html)非常详细 。**十分重要**必看。

## 四、视频自动播放

设置属性 autoplay

But , Android 始终不能自动播放，需要手动调用：

```js
var player = document.getElementById('player');
player.play();
```

开发中，遇到一个问题，在微信中始终无法实现自动播放，因为IOS和微信都是要求用户有操作后才能自动播放影音视频。

这里，找到了一个hack方法：

**微信中，可以监听 WeixinJSBridgeReady 事件，来实现视频的自动播放**

```js
 //也可以在这个事件触发后播放一次然后暂停（这样以后视频会处于加载状态，为后面的流畅播放做准备）
document.addEventListener("WeixinJSBridgeReady", function (){ 
    video.play();
    video.pause();
}, false)
```

## 五、黑屏问题

ios 在播放视频时，会出现短暂的黑屏（透屏），再正常显示。

为了避免不正常显示，我们可以这样做：

在视频上层覆盖一个 使用视频第一帧的图片填充的“div 块”，制造播放假象。然后监听事件 timeupdate ，视频播放有画面时移除这个“div块”

```js
video.addEventListener('timeupdate', function () {
    // 当视频的 timeupdate 大于0.1时表示黑屏已过，已有视频画面，可以移除浮层
    // (pagestartObj 的 div 元素)
    if ( this.currentTime > 0.1) {
        pagestartObj.fadeOut(500);
    }
})
```

### 六、常用属性和事件

video 支持的属性和事件很多，但在有些属性和事件在不同的系统上跟预想的表现不一致，在尝试比较之后，以下基本可以满足需求：

**1、autoplay 属性**

```html
<video autoplay="true" />
```

设置此属性，视频将自动播放。

**2、preload 属性**

```html
 <video preload="auto” />
```

规定是否预加载视频。

可能的值：

* auto – 当页面加载后载入整个视频
* meta – 当页面加载后只载入元数据
* none – 当页面加载后不载入视频

如果设置了 autoplay 属性，则忽略该属性。

 **3、timeupdate 事件**

视频的播放和暂停主要是调用play和pause方法。 而视频播放过程中如果需要一些用户的交互主要是通过timeupdate方法来监听当前的播放时间，代码如下：

```js
var isStop = false;
videoElem.on('timeupdate', function () {
    var curTime = parseInt(videoElem[0].currentTime);
    if (curTime == 152) { // 该时间点展示交互蒙层
        $('.js_first_stop').removeClass('hide');
    } else if (curTime > 152 && curTime == 153) {
        if (!isStop) { // 解决ios暂停后再次点击播放不了问题，因为该处触发了多次，但是andriod没有该问题。
            isStop = true;
            videoElem[0].pause();
        }
    } else if (curTime == 248) {
        $('.js_second_stop').removeClass('hide');
    }
});
```

在ios中监听timeupdate事件并暂停的视频的时候需要引入一个全局的isStop变量，不然下次点击继续播放的时候没反应（timeupdate的时候触发了多次暂停），但是andriod是没有这个问题的。

**4、ended 事件**

监听视频播放结束

```js
video.addEventListener('ended', function () {
    // 播放结束时触发
})
```

或者监听视频的timeupdate事件，然后判断ended属性，如果为true则表示结束，false表示未结束。

```js
videoElem.on('timeupdate',function(){
   if(videoElem[0].ended){
    //播放结束
   }
}
```

另外在andriod端开启了同层播放器，微信端也提供了2个监听进入同层播放器和退出同层播放器的事件。 进入同层播放器事件（开始播放视频）。

```js
videoElem.on("x5videoenterfullscreen", function(){}
```

点击左上角返回键退出同层播放器。

```js
videoElem.on('x5videoexitfullscreen',function(){}
```

最后需要注意的是在andriod端播放视频后是不会主动退出同层播放器的。**后续如果有展示的界面，也会在播放器中展示**，感觉很怪异。这里可以通过**链接跳转**来解决。

**5、canvas播放视频**

canvas可以播放视频，但是在某些andriod机上会看到有很严重的锯齿，并且有些andriod浏览器播放的时候只有声音而没有图像。

**6、视频编码**

mp4格式的视频要h.264编码方式，不然某些ios只有声音而没有图像。

## 后记：

网上关于video介绍的文章也挺多，通过搜集和自己的开发经验，这里整理了一些问题：

* 因为视频是一边播放一边加载，因此不但视频的大小会影响加载体验，视频的清晰度对加载体验影响更大。
* 建议视频1S平均大小范围控制在0.09~0.17M
* 视频格式建议使用mp4
* 如果 在android 环境中，想要隐藏 video 播放器，style属性 这样写：{ position: relative; display: none; z-index: -1; }

最后，一个完整的video配置的如下，仅供参考

```html
//html
<video
  id="video1" 
  src="src_mp4" 
  preload="auto"
  playsinline="true"
  webkit-playsinline="true"

  x-webkit-airplay="allow" 
  x5-video-player-type="h5"  
  x5-video-player-fullscreen="true"
  x5-video-orientation="portraint"
  style="object-fit:fill; width: 100%; height: 100%;">

</video>
```

```js
//js
var video = document.querySelector('video');
videoMethod(video);

function videoMethod(video) {
    // 诱导用户触摸
    video.addEventListener('touchstart', function () {
        video.play();
    });

    setTimeout(function () { video.play(); }, 1000);

    // 微信webview全局内嵌，WeixinJSBridgeReady方法
    document.addEventListener("WeixinJSBridgeReady", function (){ 
        video.play();
        video.pause();
    }, false);

    video.addEventListener('ended', function (e) {
      video.play();
    })
    //进入全屏
    video.addEventListener("x5videoenterfullscreen", function(){
      window.onresize = function(){
        video.style.width = window.innerWidth + "px";
        video.style.height = window.innerHeight + "px";
      }
    })
    //退出全屏
    video.addEventListener("x5videoexitfullscreen", function(){
      window.onresize = function(){
        video.style.width = 原尺寸;
        video.style.height = 原尺寸;
      }
    })
}

//引用js
iphone-inline-video
```

```css
//css
.IIV::-webkit-media-controls-play-button,
.IIV::-webkit-media-controls-start-playback-button {
  opacity: 0;
  pointer-events: none;
  width: 5px;
}
```

## 工具推荐

[handbrake.fr](https://handbrake.fr/) 视频压缩工具

[dat.gui](https://github.com/dataarts/dat.gui) 一个轻量级的图形用户界面库

## 参考资料：

[H5Video.js](https://github.com/cailven/H5Video.js)

[如何制作一个完美的全屏视频H5](https://juejin.im/entry/59917407518825486f1e7fb4)

[h5视频活动踩坑](https://zhuanlan.zhihu.com/p/33693226)

[h5视频播放解决方案](https://juejin.im/entry/59799f5ff265da3e2b32eaa6)

[半深入理解CSS3 object-position/object-fit属性](http://www.zhangxinxu.com/wordpress/2015/03/css3-object-position-object-fit/)
