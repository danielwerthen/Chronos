define(["connector","render-v2","scenario","jquery"],function(e,t){function n(e){return e*window.innerWidth}function r(e){return e*window.innerHeight}t.onLoop(function(e,n){$("#counter").html(e);if(!t.getBackground())return;t.getBackground().animate({color:"#262326"},n/2,function(){t.getBackground().animate({color:"#131013"},n/2)})}),t.onInit(function(){})})