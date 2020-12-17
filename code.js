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
    onTowerClick() {
        //if a ring is not yet selected
        //document.querySelector(".ring.selected") --> returns either null or the currently selected ring
        let selectedRing = document.querySelector(".ring.selected");
        let topRing = this.getTopRing();
        if (selectedRing === null) {
            //add "selected" class to htmlTowerElement and the topRing
            // this.htmlTowerElement.classList.add("selected");
            topRing.classList.add('selected');
        } else { //ring is already selected
            if (selectedRing === topRing) {//if the selected ring is my top ring
                //deselect it
                selectedRing.classList.remove("selected");
            //else if the selected ring is smaller than my top ring OR the tower is empty
            } else if ((this.htmlTowerElement.childElementCount === 1) || (selectedRing.getAttribute("ringsize") < topRing.getAttribute('ringsize'))) {
                //move the selected ring to my tower, inserting it BEFORE the pole at the end.
                // console.log(this.htmlTowerElement.lastChildElement);
                this.htmlTowerElement.insertBefore(selectedRing, this.htmlTowerElement.children[this.htmlTowerElement.childElementCount-1]);
                selectedRing.classList.remove("selected");
                //if I am goal pole and I am complete, call playerWin()
                if (this.isGoalPole && this.isComplete()) {
                    playerWin();
                }
            }
        }
        
    }
    getTopRing() {
        //returns the topmost ring element from this tower
        //tower is ordered as follows (to make overlapping work properly)
        //LARGEST
        //LARGER
        //SMALLER
        //SMALLEST
        //POLE
        //so the topmost element is the second to last one.
        return this.htmlTowerElement.children[this.htmlTowerElement.childElementCount-2];
        
    }
    isComplete() {
        //returns a boolean stating whether or not I am a complete tower
            //this occurs when I have 4 rings in ascending order
            //since rings can only be placed in ascending order, all that matters is that I have 4 rings.
        return (this.htmlTowerElement.childElementCount === 5);
    }

    //bonus functions for visual appeal, don't worry about them yet :)
    playSelectRing(ringElement) {
        // (!) by default, rings are subject to a "long" transition for top and left.
        //move the ring top up
        //set timeout for "long" transition
            //set transition override - "no transition"
            //bind document "mousemove" to move the ring
    }
    playInsertRing(ringElement) {
        //unbind document "mousemove"
        //set transition override - "short"
        //set position to directly above pole
        //set timeout for "short" transition
            //clear transition override (back to "long")
            //move the ring top down
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
    resetGame();
}
function resetGame() {
    //reset the gamestate and the discs on the towers
}

