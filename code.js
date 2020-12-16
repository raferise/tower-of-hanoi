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
        this.htmlTowerElement
        this.isGoalPole //based on the class on the htmlTowerElement
        //bind onTowerClick
    }
    onTowerClick() {
        //if gamestate "ring" and I have rings
            //set global selected ring to my top ring
            //change game state to "pole"
        //if gamestate "pole"
            //if the selected ring is my top ring
                //deselect it
            //else if the selected ring is smaller than my top ring
                //move the selected ring to my tower
                //if I am goal pole and I am complete, call playerWin()
    }
    getTopRing() {
        //returns the topmost ring from my pole's HTML element
    }
    isComplete() {
        //returns a boolean stating whether or not I am a complete tower
            //this occurs when I have 4 rings in ascending order
            //since rings can only be placed in ascending order, all that matters is that I have 4 rings.
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
//Make 3 tower objects and store them (in order)
let towers;
//global variable - "ring" or "pole"
let gamestate;
//global variable - reference to currently selected ring HTMLElement
let selectedring;
function playerWin() {
    //you win! do a pop up and confetti
    resetGame();
}
function resetGame() {
    //reset the gamestate and the discs on the towers
}

