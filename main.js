/******CONSTANTS*******/
const canvas = getCanvas();
// Get the canvas's bounding rectangle
const rect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

const state = [], path=[], crossRoad=[], falsePath=[], correctPath=[];
let randomG = false, maze=false, pathfinder =false ;
let isMouseDown = false ;
let mouseX, mouseY;
let counter=0, a, b, c, x1, y1, randomDirection, k, width, height, startLocation, finalLocation, lengthPath ;
let left, right, up, down, position;


function getCanvas() {
    // Select the game canvas
    const canvas = document.querySelector("#game-canvas");
    return canvas;
}

function setCanvasSize() {
    const parent = canvas.parentNode;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
}

function getCanvasSize() {
    return {
        width: canvas.width,
        height: canvas.height
    }
}

function clearScreen() {
    const { width, height } = getCanvasSize();
    ctx.clearRect(0, 0, width, height);
}

function drawSquare(x, y, size, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, size, size);
    
}

function drawSquareBorder(x, y, size, fill,borderColor, borderWidth = 0.5, radius = 0) {
    ctx.fillStyle = fill;
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;

    // Begin path for rounded rectangle
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + size - radius, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
    ctx.lineTo(x + size, y + size - radius);
    ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
    ctx.lineTo(x + radius, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    ctx.fill();

    // Stroke the rectangle border
    ctx.stroke();
}

function drawSchema(height,draw,color,borderColor){
    width=-30
    for (let i=0;i<50;i++){
        width+=30
        draw(width,height,30, color,borderColor);
    }
}

function testCounter(bool){
    if ( k>=2 && counter == 0 && k==state.length &&  (x1==state[k-2].x && y1==state[k-2].y) ){bool.value = false ; randomDirection=Math.floor(Math.random()*4); return false}
    else if ((counter ==0 || counter==2) && k==state.length){ return testSquares(k-1,k-2,bool); }

    else if(counter == 0 && k!=state.length && ((x1==state[a].x && y1==state[a].y) || (x1==state[c].x && y1==state[c].y)) ){bool.value = false ; randomDirection=Math.floor(Math.random()*4); return false}
    else if (counter==0 && k!=state.length) {return firstTestSquares(a,b,c,bool)}

    else if (counter == 1 && (x1==state[b].x && y1==state[b].y) ){bool.value = false ; randomDirection=Math.floor(Math.random()*4); return false}
    else if (counter == 1 ) {return testSquares(k-1,b,bool)}

}

function testFor(i){
    if( Math.abs(x1-state[i].x)==30 && Math.abs(y1-state[i].y)==30 ) {return false}  
    else if( Math.abs(y1-state[i].y)==30 && x1==state[i].x) {return false; }
    else if( Math.abs(x1-state[i].x)==30 && y1==state[i].y) {return false; }
    else if( x1==state[i].x && y1==state[i].y) { return false; }
    else {return true}
}

function testSquares(a,b,direction){
    let i;
    for (i=0; i<state.length; i++){

        if (i==b ){
            if( Math.abs(y1-state[i].y)==30 && x1==state[i].x){randomDirection=Math.floor(Math.random()*4); direction.value=false; break;}
            else if( Math.abs(x1-state[i].x)==30 && y1==state[i].y){randomDirection=Math.floor(Math.random()*4); direction.value=false; break;}}
            
                        
        else if (i!= a && i!= b){
            if (!testFor(i)) {
                randomDirection=Math.floor(Math.random()*4); direction.value=false; break;
            }        
    }}
    if(i==state.length){counter=0;return true}                                         
    else {return false;}
}

function firstTestSquares(a,b,c,direction){
    let i;
    for (i=0; i<state.length; i++){

        if (i!= a && i!= b && i!=c){
            if (!testFor(i)) {
                randomDirection=Math.floor(Math.random()*4); direction.value=false; break;
            }
        }}
    if (i==state.length){counter++;return true}
    else {return false;}
}

function randomDirectionTest(a,b,direction,position){
    if(k==state.length){x1=state[k-1].x+a; y1=state[k-1].y+b;}
    else{x1=state[k].x+a; y1=state[k].y+b;}
        
    if ((0<=x1) && (x1<=canvas.width) && (0<=y1) && (y1<=canvas.height-30) && direction.value ){

        if (testCounter(direction)) {
            position.value = true; state.push({x:x1, y:y1}); k=state.length;
        }}

    else{ direction.value = false ; randomDirection=Math.floor(Math.random()*4);}


}


function mazeGenerator(){
    randomDirection=Math.floor(Math.random()*4); position={value:false};
    while (!position.value){
        if (!right.value && !left.value && !up.value && !down.value){
            if (k>1){
                if(counter==0 ){if (k==state.length){k-=2;}else{k--;}; a=k+1; b=k; c=k-1;}
                else if (counter==1){k-=2; counter=0;; a=k+1; b=k; c=k-1;}

            }
            else {position.value=true; randomG=false}
            left={value: true}; right={value: true}; up={value: true}; down={value: true};
        }
        else if (randomDirection==0){ randomDirectionTest(30,0,right,position);

        }else if (randomDirection==1 ){ randomDirectionTest(-30,0,left,position);
            
        }else if (randomDirection==2){ randomDirectionTest(0,-30,up,position);

        }else if (randomDirection==3){ randomDirectionTest(0,30,down,position);}
    }
}

function verifyPositionLocation(x,y){
    for (let i =0; i<state.length; i++){
        if (state[i].x==x && state[i].y==y){
            return true;
        }
    }
    return false ;
}

function correctDirection(i){

    let left=false, right=false, up=false, down=false;
    let c = 0, x1=path[i].x, y1=path[i].y, lengthCross;
    let resultOfChangeRoad;

    if (verifyPositionLocation(x1+30, y1)){
        if (i!=0){
            if (x1+30 != path[i-1].x || y1 != path[i-1].y){
                if (crossRoad.length>0){
                    if (x1+30 != crossRoad[crossRoad.length-1].x || y1 != crossRoad[crossRoad.length-1].y ){
                        right = true; c++;
                    }
                }
                else {
                    right = true; c++;
                }
            } 
        }
        else {right = true; c++}}

    if (verifyPositionLocation(x1-30, y1)){
        if (i!=0){
            if (x1-30 != path[i-1].x || y1 != path[i-1].y){
                if (crossRoad.length>0){
                    if (x1-30 != crossRoad[crossRoad.length-1].x || y1 != crossRoad[crossRoad.length-1].y ){
                        left = true; c++;
                    }
                }
                else {
                    left = true; c++;
                } 
            }
        }
        else {left = true; c++}}

    if (verifyPositionLocation(x1, y1-30)){
        if (i!=0){
            if (x1 != path[i-1].x || y1-30 != path[i-1].y){
                if (crossRoad.length>0){
                    if (x1 != crossRoad[crossRoad.length-1].x || y1-30 != crossRoad[crossRoad.length-1].y ){
                        up = true; c++;
                    }
                }
                else {
                    up = true; c++;
                } 
            } 
        }
        else {up = true; c++}}

    if (verifyPositionLocation(x1, y1+30)){
        if (i!=0){
            if ( x1 != path[i-1].x || y1+30 != path[i-1].y ){
                if (crossRoad.length>0){
                    if (x1 != crossRoad[crossRoad.length-1].x || y1+30 != crossRoad[crossRoad.length-1].y ){
                        down = true; c++;
                    }
                }
                else {
                    down = true; c++;
                } 
            } 
        }
        else {down = true; c++}}

    if (c>=2){

        crossRoad.push({p:i, x:path[i].x, y:path[i].y, r:right, l:left, u:up, d:down}); // don't forget the declaration of the table crossRoad!!
        lengthCross = crossRoad.length-1;

        while (crossRoad.length > 0){

            i=crossRoad[lengthCross].p;
            x1=path[i].x; y1=path[i].y;
            resultOfChangeRoad = changeRoads(lengthCross, x1,y1,i);
            for(let h=path.length-2; h>i; h--){
                falsePath.push(path[h]);
                path.splice(h,1);
            }

            if ( !resultOfChangeRoad ){

                if(!crossRoad[lengthCross].r && !crossRoad[lengthCross].l && !crossRoad[lengthCross].u && !crossRoad[lengthCross].d)
                    {crossRoad.pop(); lengthCross=crossRoad.length-1; i=crossRoad[lengthCross].p;
                        for(let h=path.length-2; h>i; h--){
                            falsePath.push(path[h]);
                            path.splice(h,1);
                        }
                    }
                else {
                    if ( crossRoad[lengthCross].r) {crossRoad[lengthCross].r=false; return {x:x1+30, y:y1};}
                    else if ( crossRoad[lengthCross].l) {crossRoad[lengthCross].l=false; return {x:x1-30, y:y1};}
                    else if ( crossRoad[lengthCross].u) {crossRoad[lengthCross].u=false; return {x:x1, y:y1-30};}
                    else if ( crossRoad[lengthCross].d) {crossRoad[lengthCross].d=false; return {x:x1, y:y1+30};}} 
            
            }else {
                return resultOfChangeRoad;
            }
            
        }
        if (crossRoad.length == 0 ){return {x:-1}}
    }
    else {
        if ( right) {return {x:x1+30, y:y1};}
        else if ( left) {return {x:x1-30, y:y1};}
        else if ( up) {return {x:x1, y:y1-30};}
        else if ( down) {return {x:x1, y:y1+30};}
        else {
            lengthCross = crossRoad.length-1;
            while (crossRoad.length > 0){
                
                i=crossRoad[lengthCross].p;
                x1=path[i].x; y1=path[i].y;
                resultOfChangeRoad = changeRoads(lengthCross, x1,y1,i)
                for(let h=path.length-2; h>i; h--){
                    falsePath.push(path[h]);
                    path.splice(h,1);
                }

                if ( !resultOfChangeRoad ){

                    if(!crossRoad[lengthCross].r && !crossRoad[lengthCross].l && !crossRoad[lengthCross].u && !crossRoad[lengthCross].d)
                        {crossRoad.pop(); lengthCross=crossRoad.length-1; i=crossRoad[lengthCross].p;
                            for(let h=path.length-2; h>i; h--){
                                falsePath.push(path[h]);
                                path.splice(h,1);
                            }
                        }
                    else {
                        if ( crossRoad[lengthCross].r) {crossRoad[lengthCross].r=false; return {x:x1+30, y:y1};}
                        else if ( crossRoad[lengthCross].l) {crossRoad[lengthCross].l=false; return {x:x1-30, y:y1};}
                        else if ( crossRoad[lengthCross].u) {crossRoad[lengthCross].u=false; return {x:x1, y:y1-30};}
                        else if ( crossRoad[lengthCross].d) {crossRoad[lengthCross].d=false; return {x:x1, y:y1+30};}} 
                
                }else {
                    return resultOfChangeRoad;
                }
                
            }
            if (crossRoad.length == 0  ){return {x:-1}}
        }
    }
        
}

function changeRoads(lengthCross, x1,y1,i){
    if ( crossRoad[lengthCross].r && Math.abs(x1+30 - path[i+1].x) < Math.abs(x1 - path[i+1].x)  ){
        crossRoad[lengthCross].r = false; return {x:x1+30, y:y1};

    }else if ( crossRoad[lengthCross].u && Math.abs(y1-30 - path[i+1].y) < Math.abs(y1 - path[i+1].y)  ){
        crossRoad[lengthCross].u = false; return {x:x1, y:y1-30};
    
    }else if ( crossRoad[lengthCross].l && Math.abs(x1-30 - path[i+1].x) < Math.abs(x1 - path[i+1].x)  ){
        crossRoad[lengthCross].l = false; return {x:x1-30, y:y1};
    
    }else if ( crossRoad[lengthCross].d && Math.abs(y1+30 - path[i+1].y) < Math.abs(y1 - path[i+1].y)  ){
        crossRoad[lengthCross].d = false; return {x:x1, y:y1+30};
    }
    else {return false ;}
}

function pathFinder(){
    let i=path.length-2, addition = false;

    while (pathfinder && !addition){
        
        if(path[i].y==path[path.length-1].y && path[i].x==path[path.length-1].x ){
            path.pop();
            pathfinder=false;
        }
        else {path.push (correctDirection(i)); addition = true;}// add a condition if (path[path.length-1].x ==-1){pathfinder = false }
    }
    if (path[path.length-1].x == -1 ){ path.pop(); pathfinder=false;}
    else if (addition==true) {path.splice(path.length-2,1)}
}

function renderGame() {

    // Clear screen
    clearScreen();

    if (mouseX != undefined && mouseY != undefined && randomG == false && maze == false ){
        if(startLocation==undefined){ startLocation={x:mouseX, y:mouseY}; mouseX = undefined; mouseY = undefined;}
        else if(finalLocation==undefined){ if (startLocation.x!=mouseX || startLocation.y!=mouseY){finalLocation={x:mouseX, y:mouseY}}; mouseX = undefined; mouseY = undefined;}
        else {if ((finalLocation.x!=mouseX || finalLocation.y!=mouseY) && (startLocation.x!=mouseX || startLocation.y!=mouseY) ){state.push({x:mouseX, y:mouseY});}}
        
    }
    else if (mouseX != undefined && mouseY != undefined && randomG == false && maze == true ){
        if(startLocation==undefined){ if (verifyPositionLocation(mouseX, mouseY)){startLocation={x:mouseX, y:mouseY}}; mouseX = undefined; mouseY = undefined;}
        else if(finalLocation==undefined){ if (verifyPositionLocation(mouseX, mouseY) && (startLocation.x!=mouseX || startLocation.y!=mouseY)){finalLocation={x:mouseX, y:mouseY}}; mouseX = undefined; mouseY = undefined;}
        else {if ((finalLocation.x!=mouseX || finalLocation.y!=mouseY) && (startLocation.x!=mouseX || startLocation.y!=mouseY) ){state.push({x:mouseX, y:mouseY});}}
    }
    
    if (randomG){

        left={value: true}, right={value: true}, up={value: true}, down={value: true};
        if (k==undefined){
            state.push({x:(Math.floor(Math.random()*39)+3)*30, y:(Math.floor(Math.random()*20)+3)*30});
            k=state.length;
        }
        mazeGenerator();
        maze = true;
    }
    if (pathfinder){
        pathFinder();
    }

    height=-30;
    for(let i=0; i<31; i++){
        height+=30
        if (randomG || maze){drawSchema(height,drawSquare, 'black','black');}
        else {drawSchema(height,drawSquareBorder, 'white','aqua');}
    }

    for (let i=0; i<state.length; i++){
        if (maze){drawSquareBorder(state[i].x, state[i].y, 30,'white','aqua');}
        else {drawSquare(state[i].x, state[i].y, 30,'black','black');}
    }

    if (startLocation!=undefined){drawSquare(startLocation.x, startLocation.y, 30,'red');if(path.length==0){path[0]=startLocation;}}
    if (finalLocation!=undefined){if(pathfinder || path.length==1){path.push(finalLocation)};drawSquare(finalLocation.x, finalLocation.y, 30,'green');}

    if (path.length>2 && maze ){
        if (!pathfinder){

            if (3<path.length){
                lengthPath = path.length-2;
                addCorrectPath();

            }
            for (let i=1; i<path.length-1; i++){
                drawSquareBorder(path[i].x, path[i].y, 30,'aqua','black');
            }
            for (let i=0; i<correctPath.length-1; i++){
                drawSquareBorder(correctPath[i].x, correctPath[i].y, 30,'yellow','black');
            }
            for (let i=0; i<falsePath.length; i++){
                drawSquareBorder(falsePath[i].x, falsePath[i].y, 30,'aqua','black');
            }
            
        }
        else{
            for (let i=1; i<path.length-1; i++){
                drawSquareBorder(path[i].x, path[i].y, 30,'aqua','black');
            }
            for (let i=0; i<falsePath.length; i++){
                drawSquareBorder(falsePath[i].x, falsePath[i].y, 30,'aqua','black');
            }
        }
    }

}
function addCorrectPath(){
    correctPath.push(path[lengthPath]);
    path.splice(lengthPath,1)

}
    // Draw game

function gameLoop() {
    // Main game
    renderGame();

    // End calls
    window.requestAnimationFrame(gameLoop);
}

function mouseState(a,b){
    
        // Check if the mouse is within the canvas bounds
        if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
            mouseX = a-517;
            mouseY = b-87;
            
            if (mouseX > canvas.width-5 || mouseY >canvas.height-5 || mouseX < 5 || mouseY < 5){
                mouseX = undefined; mouseY = undefined; isMouseDown = false;
            }else{
                while (mouseX % 30 != 0){mouseX--;}
                while (mouseY % 30 != 0){mouseY--;}
                isMouseDown = true;
            }
        }
}


function main() {
    // Set canvas width & height automatically
    setCanvasSize();
    window.addEventListener('resize', () => {
        setCanvasSize();
    })
    document.addEventListener('mousedown', (e) => {
        if (!randomG){
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            // Calculate mouse position relative to the canvas
            mouseState(e.clientX, e.clientY);
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    document.addEventListener('mousemove', (e) => {
        if(isMouseDown){
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            // Calculate mouse position relative to the canvas
            mouseState(e.clientX, e.clientY);
        }
    });


    document.addEventListener('keyup', (e) => {
        switch(e.key){
            case 'c': state.length=0; path.length=0; falsePath.length=0; correctPath.length=0; maze=false; pathfinder=false; randomG=false; k=undefined; mouseX = undefined; mouseY = undefined; startLocation=undefined; finalLocation=undefined; break; 
            case 'r': if( state.length == 0  && randomG == false && startLocation==undefined && finalLocation==undefined) {randomG=true};break;
            case 'f': if (startLocation!=undefined && finalLocation!=undefined){pathfinder = true;}
        }
    })

    // Run game
    window.requestAnimationFrame(gameLoop)
}


/****Main call*****/
main();