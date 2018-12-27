
import mvideo from '../src/index';
import * as dat from 'dat.gui';

var wy = "http://zhidingfun.test.qingcdn.com/wykl7.mp4";
var mt = "http://f2er.meitu.com/dxw/watsons_no/dist/medias/test.mp4";

window.onload = function () {
    var h5vid = new mvideo({
        mp4: wy,
        ele: "#videoContainer",
        controlConfig: [
            {
                time: 2.0, handle: function () {
                    console.log("point1")
                }
            }, {
                time: 5.0, handle: function () {
                    console.log("point2")
                }
            }, {
                time: 8.0, handle: function () {
                    console.log("point3")
                }
            },
        ]
    });

    const gui = new dat.GUI();

    var Configuracion = function () {
        this.play = function () {
            h5vid.play();
        };
        this.pause = function () {
            h5vid.pause();
        };
        this.mute = false;
        this.seek = 0;
    }
    var conf = new Configuracion();

    var play = gui.add(conf, 'play');
    var pause = gui.add(conf, 'pause');
    var seek = gui.add(conf, 'seek', 0, 100);
    var mute = gui.add(conf, 'mute');

    mute.onChange(function (data) {
        h5vid.mute(data);
    }.bind(this));
    seek.onChange(function (data) {
        h5vid.seek(data)
    }.bind(this))
}
