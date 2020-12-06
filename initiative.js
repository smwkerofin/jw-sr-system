/// The actor class represents someone or something that acts in a round
class Actor {
  constructor(name, dex) {
    this.name=name;
    this.dex=dex;
    this.coordination=false;
    this.mobility=false;
    this.slow=false;

    this.tokens_held=0;
  }

  set_dex(dex) {
    this.dex=dex;
  }

  set_coordination_active(active) {
    this.coordination=active;
  }

  set_mobility_active(active) {
    this.mobility=active;
  }

  set_slow_active(active) {
    this.slow=active;
  }

  get_name() {
    return this.name;
  }

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

  add_token() {
    this.tokens_held++;
  }

  available_tokens() {
    return this.tokens_held;
  }

  spend_tokens(count) {
    this.tokens_held-=count;
  }
}

class TokenBag {
  constructor() {
    this.bag=[];
    this.actors=[];
    this.drawn_this_round=[];
  }

  start_round() {
    this.bag=[];
    this.actors=[];
    this.drawn_this_round=[];
  }

  add_actor(actor) {
    let toks=actor.get_tokens();
    let i=0;
    for(i=0; i<toks; i++) {
      this.bag.push(actor);
    }
    this.actors.push(actor);
  }

  shuffle() {
    let i=0;
    for(i=this.bag.length-1; i>0; i--) {
      let j=Math.floor(Math.random()*i);
      let k=this.bag[i];
      this.bag[i]=this.bag[j];
      this.bag[j]=k;
    }
  }

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

  end_of_round() {
    return this.drawn_this_round.length>=this.actors.length;
  }
}

function test() {
     let pc=new Actor("Harsta", 17);
     let message=pc.get_name()+" has a base of "+pc.get_tokens()+" tokens";
     alert(message);
     pc.set_coordination_active(true);
     pc.set_mobility_active(true);
     message="With Coordination and Mobility this changes to "+pc.get_tokens();
     alert(message);
}

var bag=new TokenBag();
var actors=[
	    new Actor("Harsta", 17),
	    new Actor("Bad guy 1", 10),
	    new Actor("Bad guy 2", 10),	    
	    ];
actors[0].set_coordination_active(true);
actors[0].set_mobility_active(true);
actors[2].set_slow_active(true);

function begin_turn(out_list) {
  bag.start_round();
  let i=0;
  for(i=0; i<actors.length; i++) {
    bag.add_actor(actors[i]);
  }

  let names=[];
  for(i=0; i<bag.bag.length; i++) {
    names.push(bag.bag[i].get_name());
  }
  bag.shuffle();

  let output="";

  while(!bag.end_of_round()) {
    actor=bag.draw_next();
    output+="<li>"+actor.get_name()+"\n";
  }

  document.getElementById(out_list).innerHTML=output;
}
