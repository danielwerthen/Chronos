define(["socket.io","_"],function(){function o(){e.emit("ping",{time:(new Date).getTime()})}var e=io.connect("/"),t=[],n=0,r=0,i=function(){return(new Date).getTime()-r},s=!1;e.on("ping",function(e){n=((new Date).getTime()-e.yours.time)/2,t.push(n),t.length>3&&t.splice(0,1);var i=_.reduce(t,function(e,t){return e+t},0)/t.length;r=(new Date).getTime()-(e.now+i);if(t.length<3)o();else{setTimeout(o,7e3);if(!s){for(var a in u)u[a]();s=!0}}}),o();var u=[];return{socket:e,currentTime:i,onEstablished:function(e){s?e():u.push(e)}}})