//createUserDivElement(user_details.name,true);



var connection = new RTCMultiConnection();
//connection.autoCloseEntireSession = true;
connection.dontCaptureUserMedia = true;
var stream = connection.getRemoteStreams('techkillahost');

connection.socketURL = "/";


 connection.userid = "techkilladmin";
 connection.extra = {
   uniqueId:"axadafsdfas",
   fullName:"Admin"

 };


 connection.join("techkilla",function(isJoinedRoom, roomid, error)
 {
      if(error)
      {
           if(error === connection.errors.ROOM_NOT_AVAILABLE)
               alert("STREAM NOT AVAILABLE");
      }


         

 });


   connection.onstream = function(event) {

      if (event.type === 'local' || event.userid == "techkillahost")
           return;

    var video;

    if(event.extra.type.search("keynote") == 0)
        video = document.getElementById("video");
    else
        video = document.getElementById("video2");

    video.srcObject = event.stream;

    setTimeout(function(){

      video.play();
    },1000);
  //  video.width = innerWidth - 20;
  //  video.height = innerHeight - 20;

    setTimeout(function(){
      video.play();
    },1000);
 };
