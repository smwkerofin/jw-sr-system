
/**
 *  Shuffles an array in place using Fisher Yates
 *
 * @param[in,out] arr Array to shuffle
 */
function shuffle(arr) {
  for(i=arr.length-1; i>0; i--) {
    let j=Math.floor(Math.random()*i);
    let k=arr[i];
    arr[i]=arr[j];
    arr[j]=k;
  }
}

/**
 * Calculate the number of tokens a character has per round
 *
 * @param[in] dex Dexterity of the character
 * @param[in] coord true if Coordination is cast on the character
 * @param[in] mobility true if Mobility is cast on the character
 * @param[in] slow true if Slow is cast on the character
 * @return Number of tokens the character has per round
 */
function get_tokens(dex, coord, mobility, slow) {
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

    if(coord) {
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

// Bag of tokens
var token_bag=[];

/**
 * Add a number of tokens to token_bag for a chacacter.
 *
 * @param[in] name Name of the character, this is also the value
 * stored in the token bag
 * @param[in] dex Dexterity of the character
 * @param[in] coord true if Coordination is cast on the character
 * @param[in] mobility true if Mobility is cast on the character
 * @param[in] slow true if Slow is cast on the character
 */
function add_unit(name, dex, coord, mobility, slow) {
  var count=get_tokens(dex, true, true, false);
  for(i=0; i<count; i++) {
    token_bag.push(name);
  }
}

// Load test data
add_unit("Harsta", 17, true, true, false);
add_unit("Bad guy 1", 14, false, false, false);
add_unit("Bad guy 2", 14, false, false, true);

// Shuffle the tokens
shuffle(token_bag);

/**
 * Draw the next token from the token bag, which is assumed to have
 * been shuffled.
 *
 * @param[in] name ID of the HTML element to display the drawn token
 * @param[in] remaining ID of the HTML element to display the remaining
 * tokens
 */
function draw_next(name, remaining) {
  if(token_bag.length>0) {
    let nxt=token_bag[0];
    token_bag.shift();
    document.getElementById(name).innerHTML = nxt;
  } else {
    document.getElementById(name).innerHTML = "None left";
  }
  document.getElementById(remaining).innerHTML = token_bag;
}
