define(["connector","_","jc","jquery"],function(e){function r(){return 6e4/(n.bpm||100)}function i(){jc.start("canvas",!0),t=jc.rect(0,0,window.innerWidth,window.innerHeight,"#131013",!0).id("background"),a&&a()}function s(){var t,i=r()*4,s=e.currentTime(),u=n.start+Math.ceil((s-n.start)/i)*i;setTimeout(function(){o(Math.round((e.currentTime()-n.start)/i),i)},u-e.currentTime())}function o(e,t){l&&l(e,t),setTimeout(function(){s()},10)}function a(){for(var e in u)u[e]()}function l(e,t){for(var n in f)f[n](e,t)}var t,n={bpm:100,start:(new Date).getTime()};$(function(){function t(){e.attr("height",window.innerHeight),e.attr("width",window.innerWidth)}var e=$("#canvas");n.bpm=Number(e.data("bpm")),n.start=Number(e.data("start")),$(window).resize(function(){t(),jc.clear(),i()}),t(),i()}),e.socket.on("loop-stats",function(e){n=e}),s();var u=[],f=[];return{getBackground:function(){return t},onInit:function(e){u.push(e)},onLoop:function(e){f.push(e)},stats:n}})