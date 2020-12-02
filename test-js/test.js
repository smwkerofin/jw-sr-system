function do_stuff() {
  document.getElementById("output").innerHTML = "Changed";
}

// Shuffles an array in place using Fisher Yates
function shuffle(arr) {
  for(i=arr.length-1; i>0; i--) {
    let j=Math.floor(Math.random()*i);
    let k=arr[i];
    arr[i]=arr[j];
    arr[j]=k;
  }
}

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

var bag=[];

function add_unit(name, dex, coord, mobility, slow) {
  var count=get_tokens(dex, true, true, false);
  for(i=0; i<count; i++) {
    bag.push(name);
  }
}

add_unit("Harsta", 17, true, true, false);
add_unit("Bad guy 1", 14, false, false, false);
add_unit("Bad guy 2", 14, false, false, true);

function draw_next(name, remaining) {
  if(bag.length>0) {
    let nxt=bag[0];
    bag.shift();
    document.getElementById(name).innerHTML = nxt;
  } else {
    document.getElementById(name).innerHTML = "None left";
  }
  document.getElementById(remaining).innerHTML = bag;
}
