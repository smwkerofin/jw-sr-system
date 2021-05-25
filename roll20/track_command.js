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

function haveMobilityCast(cid) {
    return getAttrByName(cid, "mobilCast")=="on";
}

function haveCoordCast(cid) {
    return getAttrByName(cid, "coordCast")=="on";
}

function haveSlowCast(cid) {
  // Char sheet doesn't support this yet
    return false;
}

function list_tokens(who) {
  say("list tokens");

  var tokens=filterObjs(function(obj) {
      return obj.get('subtype')=='token';
    });

  let i=0;
  for(i=0; i<tokens.length; i++) {
    say(tokens[i].get('name'));
    var cid=tokens[i].get('represents');
    //say(cid);
  }

  say("list characters");
  var chars=filterObjs(function(obj) {
      return obj.get('type')=='character';
    });
  for(i=0; i<chars.length; i++) {
    say(chars[i].get('name'));
    //say("id="+chars[i].id);
    let dex=getAttrByName(chars[i].id, "curdex");
    say("dex="+dex);
    if(haveMobilityCast(chars[i].id)) {
      say("Mobility active");
    }
    if(haveCoordCast(chars[i].id)) {
      say("Coordination active");
    }

    say("Tokens="+calc_tokens(dex, haveMobilityCast(chars[i].id),
			      haveCoordCast(chars[i].id),
			      haveSlowCast(chars[i].id)));
  }
  var npcs = findObjs({ type: 'character', controlledby: '' });
  say("NPCs");
  for(i=0; i<npcs.length; i++) {
    say(npcs[i].get('name'));
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

function calc_tokens(dex, coordination, mobility, slow) {
    let toks=1;
    if(dex<=8) {
        toks=1;
    } else if(dex<=12) {
        toks=2;
    } else if(dex<=15) {
        toks=3;
    } else if(dex<=18) {
        toks=4;
    } else {
        toks=5;
    }

    if(coordination) {
        toks++;
    }
    if(mobility) {
        toks++;
    }
    if(slow) {
        toks--;
    }

    if(toks<1) {
      toks=1;
    }

    return toks;
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

// Attributes on RQ:G sheet
// curdex
// mobilCast on/0
// coordCast on/0
