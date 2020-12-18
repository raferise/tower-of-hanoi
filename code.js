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
                (selectedRing.getAttribute("ringsize") < topRing.getAttribute('ringsize'))) {
                //insert the ring into the tower
                this.playInsertRing(selectedRing);
                //if I am goal pole and I am complete, call playerWin()
                if (this.isGoalPole && this.isComplete()) {
                    playerWin();
                }
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
    isComplete() {
        return (this.htmlTowerElement.childElementCount === 5);
    }
    //moves the provided ring to my tower, inserting it BEFORE the pole at the end.
    insertRing(ringElement) {
        this.htmlTowerElement.insertBefore(ringElement, this.htmlTowerElement.children[this.htmlTowerElement.childElementCount-1]);
    }
    
    playSelectRing(ringElement) {
        //halt transitions while clearing positioning and selecting
        ringElement.style.transitionDuration = "0s";
        ringElement.style.top = ringElement.offsetTop+"px";
        ringElement.style.marginTop = "0px";
        ringElement.classList.add('selected');
        ringElement.parentElement.classList.add("selected");
        ringElement.offsetTop; //makes browser calculate the value. breaks if this isn't here /shrug
        ringElement.style.transitionDuration = "0.4s";
        ringElement.style.top = "10px";
        
        setTimeout(function() {
            //render behind towers so clicking it doesn't send it back to home
            ringElement.style.zIndex = "-1";
            //disable transitions and start mouse following effect
            ringElement.style.transitionDuration = "0s";
            dragRing(ringElement);
        }, 400);
    }
    playInsertRing(ringElement) {
        ringElement.parentElement.classList.remove("selected");
        cancelDragRing();
        ringElement.style.zIndex = "unset"; //reset z-index
        this.insertRing(ringElement);
        ringElement.style.transitionDuration = "0.2s";
        ringElement.style.left = (this.htmlTowerElement.offsetLeft + this.htmlTowerElement.clientWidth/2)-(ringElement.clientWidth/2)+"px";
        // console.log(this.htmlTowerElement.offsetLeft);
        setTimeout(function() {
            ringElement.style.transitionDuration = "0s";
            ringElement.classList.remove('selected');
            let desiredTop = ringElement.offsetTop;
            ringElement.classList.add('selected');
            ringElement.style.transitionDuration = "0.4s";
            ringElement.style.top = desiredTop+"px";
            setTimeout(function() {
                ringElement.style = "";
                ringElement.classList.remove('selected');
            },400);
        },200);
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
    //you win! do a pop up and confetti
    let modal = document.querySelector(".info-popup");
    modal.style.visibility = "visible";
    modal.innerText = "YOU WIN!!!!!!!!!!!!!";
    resetGame();
}
function resetGame() {
    //reset the gamestate and the discs on the towers
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