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

// Our bag
var bag=new TokenBag();
// Default actors for testing
var actors=[
	    new Actor("Harsta", 17),
	    new Actor("Bad guy 1", 10),
	    new Actor("Bad guy 2", 10),	    
	    ];
actors[0].set_coordination_active(true);
actors[0].set_mobility_active(true);
actors[2].set_slow_active(true);

/**
 * Begin a new turn.  The actors are added to the bag and the
 * turn order output as a list
 *
 * @param[in] out_list ID of the HTML list to contain the turn order
 * (string)
 */
function begin_turn(out_list) {
  // Clear the bag
  bag.start_round();

  // Add our actors to the bag
  let i=0;
  for(i=0; i<actors.length; i++) {
    bag.add_actor(actors[i]);
  }

  // Give it a good shake
  bag.shuffle();

  // Draw the tokens out of the bag until we reach the end of the turn
  // and add the names to the list
  let output="";
  while(!bag.end_of_round()) {
    actor=bag.draw_next();
    output+="<li>"+actor.get_name()+"\n";
  }

  // Update HTML list
  document.getElementById(out_list).innerHTML=output;
}
