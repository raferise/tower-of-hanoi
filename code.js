//RULES:
// 1. You can only take the top most ring from a pole.
// 2. You can only put a ring on a ring that is bigger (or an empty pole)

//HOW TO PLAY THE GAME
// 1.  player chooses a ring 
// 1.a check the rules before allowing the ring to be chosen
// 2.  player chooses a pole
// 2.a check the rules before the ring moves
// 3. ring moves
// 4.  check if the rings are in appropriate order
// 4.a if things are in order on the last pole, they win!(confetti!)

// JS CODE OUTLINE
// Class (which becomes multiple Objects) to represent towers
class Tower {
    constructor(htmlTowerElement) {
        this.htmlTowerElement = htmlTowerElement;
        //whether or not htmlTowerElement has the class "goal"
        this.isGoalPole = htmlTowerElement.classList.contains("goal");
        //adds a click event listner to onTowerClick. bind(this) makes the 'this' keyword in the callback refer to this object.
        htmlTowerElement.addEventListener("click", this.onTowerClick.bind(this));
    }
    onTowerClick(event) {
        let selectedRing = document.querySelector(".ring.selected");
        let topRing = this.getTopRing();
        if (selectedRing === null) { //if a ring is not yet selected
            if (this.htmlTowerElement.childElementCount > 1) { //i have rings
                this.playSelectRing(topRing);
            }
        } else { //ring is already selected
            //if replacing the ring, or the tower is empty, or the ring is smaller than the next target
            if ((selectedRing === topRing) ||
                (this.htmlTowerElement.childElementCount === 1) ||
                (selectedRing.getAttribute("ringsize") < topRing.getAttribute("ringsize"))) {
                //insert the ring into the tower
                this.playInsertRing(selectedRing);
            } else {
                //you must have broken the rules :(
                this.playError();
            }
        }
        
    }
    //returns the topmost ring element from this tower
    //order goes div.large + div.medium + div.small + div.pole
    //so this is the 2nd to last child.
    getTopRing() {
        return this.htmlTowerElement.children[this.htmlTowerElement.childElementCount-2];
        
    }
    //returns a boolean stating whether or not I am a complete tower
        //this occurs when I have 4 rings in ascending order
        //since rings can only be placed in ascending order, all that matters is that I have 4 rings.
        //if there were more rings/towers/goals this could be adjusted.
    isComplete() {
        return (this.htmlTowerElement.childElementCount === 5);
    }

    //moves the provided ring to my tower, inserting it BEFORE the pole at the end.
    insertRing(ringElement) {
        this.htmlTowerElement.insertBefore(ringElement, this.htmlTowerElement.children[this.htmlTowerElement.childElementCount-1]);
    }
    
    //plays the select ring animation and selects it
    playSelectRing(ringElement) {
        //halt transitions while clearing positioning and selecting
        ringElement.style.transitionDuration = "0s";
        //put the ring in the same place, since .selected causes it to be absolute pos
        ringElement.style.top = ringElement.offsetTop+"px";
        ringElement.style.marginTop = "0px";
        ringElement.classList.add('selected');
        ringElement.offsetTop; //makes browser calculate the current top. breaks transition if this isn't here
        ringElement.style.transitionDuration = "0.3s";
        ringElement.style.top = "10px";
        
        setTimeout(function() {
            //render behind towers so clicking it doesn't send it back to home
            ringElement.style.zIndex = "-1";
            //disable transitions and start mouse-following effect
            ringElement.style.transitionDuration = "0s";
            dragRing(ringElement);
        }, 400);
    }
    //plays the insert ring animation and inserts it
    //also checks for win condition, it was originally elsewhere
    //but it feels better if the popup appears after your last ring
    //hits the bottom
    playInsertRing(ringElement) {
        cancelDragRing();
        ringElement.style.zIndex = "unset"; //reset z-index
        this.insertRing(ringElement);
        ringElement.style.transitionDuration = "0.2s";
        //align element to pole
        ringElement.style.left = (this.htmlTowerElement.offsetLeft + this.htmlTowerElement.clientWidth/2)-(ringElement.clientWidth/2)+"px";
        //timeouts use bind to transfer this keyword
        setTimeout(function() {
            //figure out where it's going to be when flex does magic
            ringElement.style.transitionDuration = "0s";
            ringElement.classList.remove('selected');
            let desiredTop = ringElement.offsetTop;
            //then transition to that position
            ringElement.classList.add('selected');
            ringElement.style.transitionDuration = "0.3s";
            ringElement.style.top = desiredTop+"px";
            setTimeout(function() {
                ringElement.style = "";
                ringElement.classList.remove('selected');
                //if I am goal pole and I am complete, call playerWin()
                if (this.isGoalPole && this.isComplete()) {
                    playerWin();
                }
            }.bind(this),400);
        }.bind(this),200);
    }
    //plays the error animation showing the top ring is too small
    playError() {
        let badRing = this.getTopRing();
        let errorPopup = document.createElement('span');
        errorPopup.innerText = "×";
        badRing.append(errorPopup);
        errorPopup.classList.add('error');
        //use bind to transfer this keyword
        setTimeout(function() {
            errorPopup.remove();
        }.bind(this), 1000);
    }
}

//GAME CONTROLLER
//Make 3 tower objects and store them.
let towers = [];
document.querySelectorAll(".tower").forEach(element => {
    towers.push(new Tower(element));
});
//no global variables will be necessary! I did some thinking and we can actually store gamestate AND the selected ring
//INSIDE the HTML and with a SINGLE VALUE!!!
//We can do this by applying the .selected class to a ring. This not only gives us a way to find the selected ring with .querySelector
//but it also differentiates between what a click on a tower should do
//because the first click adds a .selected class and the second click moves the .selected and removes its class.
//we can also use a class to mark which pole is the goal pole, and make its object recognize that and do the checks.
//that means the only global-scope things we need is a list of the towers and methods to reset the game / show the "You Win!" popup.
function playerWin() {
    let win = document.querySelector(".win");
    showPopup(win);
    //use the party.js library to make confetti :)
    party.element(win, {
        count: 100,
        countVariation: 0.5,
        angle: 180,
        angleSpan: 80,
        velocity: 900,
        yVelocity: -300,
        yVelocityVariation: 1,
        rotationVelocityLimit: 6,
        scaleVariation: 0.8,
        });
    party.element(win.parentElement, {
        count: 50,
        countVariation: 0.5,
        angleSpan: 80,
        velocity: 100,
        rotationVelocityLimit: 6,
        scaleVariation: 0.8,
        gravity: false
        });
}
function resetGame() {
    let rings = Array.from(document.querySelectorAll(".ring"));
    rings.sort((a,b) => a.getAttribute("ringsize") - b.getAttribute("ringsize"));
    rings = rings.reverse();
    for (ring of rings) {
        towers[0].insertRing(ring);
    }

}
document.querySelector(".directions button").addEventListener("click", function() {
    hidePopup(this.parentElement);
});
document.querySelector(".win button").addEventListener("click", function() {
    resetGame();
    hidePopup(this.parentElement);
});
function showPopup(htmlElement) {
    htmlElement.classList.remove("closed");
    //show the .info-popup element
    htmlElement.parentElement.classList.remove("closed");
}
function hidePopup(htmlElement) {
    htmlElement.classList.add("closed");
    //hide the .info-popup element
    htmlElement.parentElement.classList.add("closed");
}

//function to cancel dragging that gets bound by an instance of the dragRing function
let cancelDragRing;
//drags a ring. provide a source 
function dragRing(ringElement) {
    if (!(ringElement instanceof Node)) {
        throw new Error("dragRing must be called on a Node object");
    }
    document.addEventListener("mousemove", doDrag);
    cancelDragRing = stopDrag;
    let vel = 0;
    let posX = ringElement.offsetLeft + ringElement.clientWidth/2;
    let currX = posX;
    let autoStep = null;
  
    function doDrag(event) {
        //failsafe for animation frames after stopDrag
        if (ringElement === null) return;
        //when triggered from mouse drag and not animaiton frame
        if (event instanceof Event) {
            event.preventDefault();
            currX = event.clientX;
            vel = currX - posX;
            doPhysics();
            clearTimeout(autoStep);
            autoStep = setTimeout(function() {
                autoStep = null;
                requestAnimationFrame(doDrag);
            },10);
        } else {
            vel = currX - posX;
            doPhysics();
            if (((vel > 2)||(vel < -2))&&(autoStep === null)) {
                requestAnimationFrame(doDrag);
            }
        } 
    }

    function doPhysics() {
        posX += vel/20;
        ringElement.style.left = (posX - ringElement.clientWidth/2) + "px";
    }

    function stopDrag() {
        ringElement = null;
        document.removeEventListener("mousemove", doDrag);
    }
}