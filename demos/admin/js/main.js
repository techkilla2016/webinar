var items = [];

document.getElementById("resetBtn").onclick = function(){
console.log("a");
   for(var i=0;i<items.length;i++)
   {
     document.getElementById("userlist").removeChild(items[i]);
   }

   items = [];
   connection.send({"type":"reset","id":"0"});

};


var connection = new RTCMultiConnection();
connection.userid = "techkilladmin2";

connection.socketURL = "/";

connection.session = {
    data: true,
    oneway: true
};



connection.dontGetRemoteStream = true;
connection.dontCaptureUserMedia = true;

connection.join("techkilla");


connection.onmessage = function(event) {
    var chatMesssge = event.data;

    console.log("request receive from " + event.extra.fullName);
    createItem(event.extra.fullName,event.userid);
};


function createItem(name,id)
{
  var item = document.getElementById("item0").cloneNode(true);
  item.id = "item_" + id;
  item.style.display = "";
  item.value = id;
  console.log(id);
  items.push(item);
  item.innerHTML = name + "<span class='close'>&Omicron;&Kappa;</span>";
  item.childNodes[1].addEventListener("click",sendApproval);
  document.getElementById("userlist").appendChild(item);
}

function sendApproval(e)
{
  connection.send({"type":"approval","id":e.path[1].id});
}
