// Functions
function message_handler(msg) {      
  let argv = msg.content.split(' ');
  let sub_cmd=argv[1];

  log("track comamnd: ", sub_cmd);
  sendChat("Track command",
	       '/w "' + _fixWho(msg.who) + '" ' + sub_cmd);
  if(sub_cmd=="list") {
    list_tokens(msg.who);
  } else if(sub_cmd=="start") {
    start_turn(msg.who);
  }
}

function list_tokens(who) {
  say("would list tokens");
}

function start_turn(who) {
  say("Start of turn");
}

function whisper(who, what) {
  sendChat("Track", '/w "' + _fixWho(who) + '" ' + what);
}

function say(what) {
  sendChat("Track", what);
}

function _fixWho(who) {
    return who.replace(/\(GM\)/, '').trim();
}

// Event handlers
on("chat:message", msg => {
    try {
      if(msg.content.startsWith("!track")) {
	message_handler(msg);
      }
    }
    catch(err) {
      log("Track command error: "+err.message);
      sendChat("Track command error: ",
	       '/w "' + _fixWho(msg.who) + '" ' + msg);
      log(err.stack);
    }
  });
