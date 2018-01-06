

function send(server, params, callback){
	var xhr = new XMLHttpRequest()
	xhr.open("GET", server, true)

  xhr.setRequestHeader("xseedData", JSON.stringify(params))

	xhr.onreadystatechange = () => {
		if(xhr.readyState == 4 && xhr.status == 200){
			callback(JSON.parse(xhr.responseText));
		}
	}
	xhr.send();
}

var _$_cache = {};
function $(elementId){
  if(elementId in _$_cache) return _$_cache[elementId];
  var e = document.getElementById(elementId);
  if (!e) return e;
  e.on = (event, callback) => {
    event = "on" + event;
    if(e[event] !== undefined) 
      e[event] = ()=>{callback(e)}
  }
	return e;
}

function noti(text, color, timeoutSecond){
	$("notiBox").style.backgroundColor = color;
	$("notiBox").style.display = "block";
	$("notiBox").innerHTML = text;
	setTimeout(()=>{
		$("notiBox").style.display = "none"
	}, timeoutSecond * 1000)
}

//this function will work cross-browser for loading scripts asynchronously
function loadScript(src, callback)
{
  var s, r, t;
  r = false;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  s.onload = s.onreadystatechange = function() {
    //console.log( this.readyState ); //uncomment this line to see which ready states are called.
    if ( !r && (!this.readyState || this.readyState == 'complete') )
    {
      r = true;
      callback();
    }
  };
  t = document.getElementsByTagName('script')[0];
  t.parentNode.insertBefore(s, t);
}

var peer = {};
loadScript("https://cdnjs.cloudflare.com/ajax/libs/peerjs/0.3.14/peer.js", ()=>{
	peer = new Peer({host: 'xseed.tech', secure: true});
	peer.on('open', (id) => {
    // log.add('Connection to peerJS server initiated. peerId = ' + id);
    localStorage['peerId'] = id;
  });

  peer.on('call', function(call) {
    console.log("Someone is calling: ", call);
    __activeCall = call;
    navigator.getUserMedia({
        video: true,
        audio: true
    }, function(stream) {
        __activeStream = stream;
        var screen = document.getElementById('my-video');
        screen.srcObject = stream;  

        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            screen = document.getElementById('incoming-video');
            screen.srcObject = remoteStream;
        });

        call.on('close', onEndCall)
        
    }, function(err) {
        console.log(err);
        alert('Không cho access camera thì gọi cái gì?');
    });
  });

  peer.on('connection', function(dStream){
    console.log("got dstream")
    __activeDStream = dStream;
    processDStream(dStream)
  })

})

var __videoStream = null;
var __activeCall = null;
var __activeDStream = null;

var onEndCall;
var call = function(peerId, streamCallback) {
  console.log('call('+peerId+') called');
  
  navigator.getUserMedia({
      video: true,
      audio: true
  }, function(stream) {
      // console.log("got Stream");
      
      __activeStream = stream;
      var call = peer.call(peerId, stream);
      call.on('stream', function(remoteStream) {
          // Show stream in some video/canvas element.
          screen = document.getElementById('incoming-video');
          screen.srcObject = remoteStream;
      });

      call.on('close', onEndCall);

      var dStream = peer.connect(peerId);

      __activeCall = call;
      __activeDStream = dStream;

      processDStream(dStream)

      var screen = document.getElementById('my-video');
      screen.srcObject = stream;  

      if(streamCallback) streamCallback(call);

  }, function(err) {
      alert("Không cho access camera thì gọi cái gì?");
      console.log(err);
  });
}

function processDStream(dStream){
  dStream.on('data', (data)=>{
    // console.log("Peer send data: ", data)
    if(data.updateSharedNotepad){
      $('sharedNotePad').value = data.updateSharedNotepad
    }
    if(data.swapRole){
      swapRole()
    }
  })
}

var socket = function(){
  var obj = {}

  var wss = new WebSocket('wss://' + window.location.hostname + ':443');
  wss.addEventListener('open', (event) => {
    // log.add('Connection to user control server initiated...');
    noti('WebSocket connection opened!', "lightgreen", 1);
  })

  wss.addEventListener('message', (m) => {
    console.log(m.data);
    m = JSON.parse(m.data);
    
    if(m.api in messageRouter){
      messageRouter[m.api](m)
    }
    
  });

  var messageRouter = {}
  obj.on = (key, callback)=>{
    messageRouter[key] = callback;
  }
  obj.send = (message) => {
    wss.send(JSON.stringify(message))
  }

  return obj;
}()


// draggable ///
var draggable = function(){
  var obj = {}
  obj._active = null;
  obj.list = {}
  document.body.onmousedown = (e)=>{
    // e = e || window.event;
    var elementId = (e.target || e.srcElement).id
    // console.log("mouse down: " + elementId)
    if (elementId in obj.list)
      obj._active = $(elementId)
  }

  //broken hotfix:
  $('videoBox').onmousedown = ()=>{
    obj._active = $('videoBox')
  }

  document.onmousemove = (e)=>{
    var drag = obj._active;
    if(!drag) return;
    var pos = drag.style.transform.split(',');
        drag.style.transform = "translate(" 
      + (Number(pos[0].substring(10, pos[0].length - 2)) + (e.movementX)) + "px,"
      + (Number(pos[1].substring(0, pos[1].length - 3)) + (e.movementY)) + "px)";
  }

  document.onmouseup = function(){
    obj._active = null;
  }

  obj.add = (elementId)=>{
    obj.list[elementId] = 1
    $(elementId).style.transform = "translate(0px, 0px)"
  }

  return obj;
}()


// singlePageApplication ///
var spa = function(){
  var obj = {};
  obj.pageList = []
  obj.activePage = null

  obj.addPage = (pageId) => {
    obj.pageList.push(pageId)
  }
  
  obj.navigateTo = (pageId) => {
    for(var i = 0; i < obj.pageList.length; i++){
      $(obj.pageList[i]).style.display = "none"
    }
    obj.activePage = $(pageId)
    $(pageId).style.display = ""
  }
 
  return obj;
}

