// Maximum DEX we can cope with
const MaxDEX=30;

/// The actor class represents someone or something that acts in a round
class Actor {
  /**
   * Constructor for the Actor class
   *
   * The actor starts with none of Coordination, Mobility or Slow cast on
   * them.
   *
   * @param[in] name Name of the actor (string)
   * @param[in] dex Dexterity of the actor (number)
   */
  constructor(name, dex) {
    this.name=name;
    this.dex=dex;
    this.coordination=false;
    this.mobility=false;
    this.slow=false;

    this.tokens_held=0;
  }

  /**
   * Change the dexterity of the actor
   *
   * @param[in] dex New dexterity of the actor (number)
   */
  set_dex(dex) {
    this.dex=dex;
  }

  /**
   * Set whether or not the Coordination spell is cast on the actor
   *
   * @param[in] active true if the spell is cast on the actor, otherwise
   * false
   */
  set_coordination_active(active) {
    this.coordination=active;
  }

  /**
   * Set whether or not the Mobility spell is cast on the actor
   *
   * @param[in] active true if the spell is cast on the actor, otherwise
   * false
   */
  set_mobility_active(active) {
    this.mobility=active;
  }

  /**
   * Set whether or not the Slow spell is cast on the actor
   *
   * @param[in] active true if the spell is cast on the actor, otherwise
   * false
   */
  set_slow_active(active) {
    this.slow=active;
  }

  /**
   * Get the name of the actor
   *
   * @return The name
   */
  get_name() {
    return this.name;
  }

  /**
   * Get the Dexterity of the actor
   *
   * @return The DEX
   */
  get_dex() {
    return this.dex;
  }

  /**
   * Get whether the Coordination spell is active on the actor
   *
   * @return true if active, false otherwise
   */
  get_coordination_active() {
    return this.coordination;
  }

  /**
   * Get whether the Mobility spell is active on the actor
   *
   * @return true if active, false otherwise
   */
  get_mobility_active() {
    return this.mobility;
  }

  /**
   * Get whether the Slow spell is active on the actor
   *
   * @return true if active, false otherwise
   */
  get_slow_active() {
    return this.slow;
  }

  /**
   * Get the number of tokens the actor should have this round, based
   * on their dexterity and spells cast on them
   *
   * @return The number of tokens (minimum 1)
   */
  get_tokens() {
    let toks=1;
    if(this.dex<=8) {
        toks=1;
    } else if(this.dex<=12) {
        toks=2;
    } else if(this.dex<=15) {
        toks=3;
    } else if(this.dex<=18) {
        toks=4;
    } else {
        toks=5;
    }

    if(this.coordination) {
        toks++;
    }
    if(this.mobility) {
        toks++;
    }
    if(this.slow) {
        toks--;
    }

    if(toks<1) {
      toks=1;
    }

    return toks;
  }

  /**
   * Actor has drawn a token, add it to the tokens available (this
   * persists from one round to the next unless spent).
   */
  add_token() {
    this.tokens_held++;
  }

  /**
   * Get the number of tokens this actor has available to spend
   *
   * @return Number of available tokens
   */
  available_tokens() {
    return this.tokens_held;
  }

  /**
   * Record that the actor has used a number of tokens
   *
   * @param[in] count The number of tokens used
   */
  spend_tokens(count) {
    this.tokens_held-=count;
  }
}

/**
 * Bag for drawing Actor's tokens out of
 * 
 * The correct sequence for usage each round is
 * * start_round()
 * * for each actor, add_actor()
 * * shuffle()
 * * while not end_of_round()
 * * * draw_next()
 */
class TokenBag {
  /// Constructor
  constructor() {
    this.bag=[];
    this.actors=[];
    this.drawn_this_round=[];
  }

  /**
   * Start a round.  The bag is emptied, along with the list of actors
   * and which actors have drawn this round
   */
  start_round() {
    this.bag=[];
    this.actors=[];
    this.drawn_this_round=[];
  }

  /**
   * Add an actor's tokens to the bag.  This should be called once per
   * actor, the method adds the appropriate number of tokens itself.
   *
   * @param[in] actor The actor to add, which should be of the Actor class
   */
  add_actor(actor) {
    let toks=actor.get_tokens();
    let i=0;
    for(i=0; i<toks; i++) {
      this.bag.push(actor);
    }
    this.actors.push(actor);
  }

  /**
   * Shuffle the tokens in the bag.
   *
   * This uses the Fisher-Yates algorithm
   */
  shuffle() {
    let i=0;
    for(i=this.bag.length-1; i>0; i--) {
      let j=Math.floor(Math.random()*i);
      let k=this.bag[i];
      this.bag[i]=this.bag[j];
      this.bag[j]=k;
    }
  }

  /**
   * Draw the next token from the bag.
   *
   * @return The next actor, or null if the bag is empty
   */
  draw_next() {
    if(this.bag.length<=0) {
      return null;
    }

    let nxt=this.bag[0];
    this.bag.shift();
    nxt.add_token();

    if(this.drawn_this_round.indexOf(nxt.get_name())==-1) {
      this.drawn_this_round.push(nxt.get_name());
    }
    return nxt;
  }

  /**
   * Have we reached the end of this round?
   *
   * Once each actor has drawn at least one token, the round ends.
   *
   * @return true if end of the round has been reached, otherwise false
   */
  end_of_round() {
    return this.drawn_this_round.length>=this.actors.length;
  }
}

/// Initiative tracker
class InitiativeTracker {
  /// Constructor
  constructor() {
    this.bag=new TokenBag();
    this.actors=[];
    // Communicate this from the HTML somehow?
    this.table_id="available";
  }

  /**
   * Add a set of debug actors for testing purposes
   */
  set_debug_actors() {
    this.actors=[
	    new Actor("Harsta", 17),
	    new Actor("Bad guy 1", 10),
	    new Actor("Bad guy 2", 10),	    
    ];
    this.actors[0].set_coordination_active(true);
    this.actors[0].set_mobility_active(true);
    this.actors[2].set_slow_active(true);

  }

  /**
   * Add an actor to the list of actors.
   *
   * If there is already an actor with the same name, a new one is
   * not added.  This also causes an alert to be shown.
   *
   * @param[in] name Name of the actor to add (string)
   * @param[in] dex Dexterity of the actor (number, defaults to 10)
   */
  add_actor(name, dex=10) {
    // Only allow one actor per name
    for(let i=0; i<this.actors.length; i++) {
      if(this.actors[i].get_name()==name) {
	alert(name+" already added");
	return;
      }
    }

    let actor=new Actor(name, dex);
    this.actors.push(actor);
  }

  /**
   * Begin a new turn.  The actors are added to the bag and the
   * turn order output as a list
   *
   * @param[in] out_list ID of the HTML list to contain the turn order
   * (string)
   */
  begin_turn(out_list) {
    // Clear the bag
    this.bag.start_round();

    // Add our actors to the bag
    let i=0;
    for(i=0; i<this.actors.length; i++) {
      this.bag.add_actor(this.actors[i]);
    }

    // Give it a good shake
    this.bag.shuffle();
    
    // Draw the tokens out of the bag until we reach the end of the turn
    // and add the names to the list
    let output="";
    while(!this.bag.end_of_round()) {
      //console.log(this.bag.bag);
      let actor=this.bag.draw_next();
      output+="<li>"+actor.get_name()+"\n";
    }

    // Update HTML list
    document.getElementById(out_list).innerHTML=output;
  }

  update_table() {
    // First build the table
    let body="<tr><th>Actor</th><th>DEX</th><th>Coordination?</th>"+
      "<th>Mobility?</th><th>Slow?</th><th>Tokens</th></tr>\n";

    for(let i=0; i<this.actors.length; i++) {
      let row="<tr>";
      row+="<td>"+this.actors[i].get_name()+"</td>";

      let dex=this.actors[i].get_dex();
      let id="actor"+i+"DEX";
      row+='<td><input type="number" id="'+id+'" value="'+dex+'"'+
	' min="1" max="'+MaxDEX+'" onchange="dex_changed('+i+')"></td>';
      
      row+='<td>'+this.create_tickbox(i, 'Coord')+'</td>';
      row+='<td>'+this.create_tickbox(i, 'Mobil')+'</td>';
      row+='<td>'+this.create_tickbox(i, 'Slow')+'</td>';

      row+='<td><div id="actor'+i+'Tokens"></div></td>';

      row+="</tr>\n";
      
      body+=row;
    }

    document.getElementById(this.table_id).innerHTML=body;

    // Now update the spell state & token count
    this.update_table_values();
  }

  create_tickbox(index, tag) {
    let id="actor"+index+tag;
    let funame=tag+"_changed("+index+")";
    return '<input type="checkbox" id="'+id+'" onchange="'+
      funame+'">';
  }

  update_table_values() {
    for(let i=0; i<this.actors.length; i++) {
      let id="actor"+i+"DEX";
      let number=document.getElementById(id);
      number.value=this.actors[i].get_dex();
      
      id="actor"+i+"Coord";
      let check=document.getElementById(id);
      check.checked=this.actors[i].get_coordination_active();
      
      id="actor"+i+"Mobil";
      check=document.getElementById(id);
      check.checked=this.actors[i].get_mobility_active();
      
      id="actor"+i+"Slow";
      check=document.getElementById(id);
      check.checked=this.actors[i].get_slow_active();

      let toks=this.actors[i].get_tokens();
      id="actor"+i+"Tokens";
      document.getElementById(id).innerHTML=toks;
    }
  }

  update_actor_dex(index, dex) {
    if(index>=0 && index<this.actors.length) {
      this.actors[index].set_dex(dex);
      this.update_table_values();
    }
  }
}

// Create our tracker and populate with debug data
var tracker=new InitiativeTracker();
tracker.set_debug_actors();

/**
 * Begin a new turn.  The actors are added to the bag and the
 * turn order output as a list
 *
 * @param[in] out_list ID of the HTML list to contain the turn order
 * (string)
 */
function begin_turn(out_list) {
  // Delegate to our class object
  tracker.begin_turn(out_list);
}

/**
 * Add a new actor.
 *
 * @param[in] tabel ID of table to show the actors in
 *
 * @todo Implement!
 */
function add_actor(table) {
  let name=document.getElementById("newActorName").value;
  let dex=document.getElementById("newActorDEX").value;
  alert("TODO: add "+name+" DEX "+dex);
  tracker.update_table();
}

function dex_changed(index) {
  console.log("DEX changed "+index);
  let id="actor"+index+"DEX";
  tracker.update_actor_dex(index, 
			   document.getElementById(id).value);
}

function Coord_changed(index) {
  console.log("Coord changed "+index);
}

function Mobil_changed(index) {
  console.log("Mobil changed "+index);
}

function Slow_changed(index) {
  console.log("slow changed "+index);
}

function update_table() {
  tracker.update_table();
}
