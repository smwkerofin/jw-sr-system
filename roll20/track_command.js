// Functions
function message_handler(msg) {      
  let argv = msg.content.split(' ');
  let sub_cmd=argv[1];

  log("track comamnd: ", sub_cmd);
  sendChat("Track command",
	       '/w "' + removeGM(msg.who) + '" ' + sub_cmd);
  if(sub_cmd=="list") {
    list_tokens(msg.who);
  } else if(sub_cmd=="start") {
    start_turn(msg.who);
  }
}

function list_tokens(who) {
  say("list tokens");

  var tokens=filterObjs(function(obj) {
      return obj.get('subtype')=='token';
    });

  let i=0;
  for(i=0; i<tokens.length; i++) {
    say(tokens[i].get('name'));
  }

  say("list characters");
  var chars=filterObjs(function(obj) {
      return obj.get('type')=='character';
    });
  for(i=0; i<chars.length; i++) {
    say(chars[i].get('name'));
    let dex=getAttrByName(chars[i].id, "curdex");
    say("dex="+dex);
  }
}

function start_turn(who) {
  say("Start of turn");
}

function whisper(who, what) {
  sendChat("Track", '/w "' + removeGM(who) + '" ' + what);
}

function say(what) {
  sendChat("Track", what);
}

function removeGM(who) {
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
	       '/w "' + removeGM(msg.who) + '" ' + msg);
      log(err.stack);
    }
  });
