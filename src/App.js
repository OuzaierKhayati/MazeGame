/******CONSTANTS*******/
const canvas = getCanvas();
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();//get the canva's bounding rectangle
const sizeSquare = 20, speed=3;
let controlSpeed;

const state = [];
let mouseX, mouseY, endWidth, endHeight, isMouseDown=false;

let finder=false;

let maze=[], left, right, up, down, position, randomDirection, counter=0, k; 
let randomG =false, randomMaze=false ; // Normally I have to declare x1 and y1 here to be able to use them in the maze function


let startLocation,finalLocation,pathfinder=false;
let path=[],crossRoad=[],falsePath=[], correctPath=[];



function getCanvas() {
    // Select the game canvas
    const canvas = document.querySelector("#game-canvas");
    return canvas;
}

function setCanvasSize() {
    const parent = canvas.parentNode;
    canvas.width = parent.offsetWidth;
    while(canvas.width%sizeSquare !=0){
        canvas.width++;
    }endWidth=canvas.width;
    
    canvas.height = parent.offsetHeight;
    while(canvas.height%sizeSquare !=0){
        canvas.height++;
    }endHeight=canvas.height;
}

function clearScreen() {
    ctx.clearRect(0, 0, endWidth, endHeight);
}

function drawSquare(x, y, size, fill,border,bordersize) {
    ctx.fillStyle = fill;
    ctx.lineWidth= bordersize ;
    ctx.strokeStyle = border;
    ctx.fillRect(x, y, size, size);
    ctx.strokeRect(x,y,size,size);
}

/*************************************MazeGenerator***********************************/
function testCounter(){
    if ( k>=2 && counter == 0 && k==maze.length &&  (x1==maze[k-2].x && y1==maze[k-2].y) ){ return false}
    else if ((counter ==0 || counter==2) && k==maze.length){ return testSquares(k-1,k-2); }

    else if(counter == 0 && k!=maze.length && ((x1==maze[a].x && y1==maze[a].y) || (x1==maze[c].x && y1==maze[c].y)) ){ return false}
    else if (counter==0 && k!=maze.length) {return firstTestSquares(a,b,c)}

    else if (counter == 1 && (x1==maze[b].x && y1==maze[b].y) ){ return false}
    else if (counter == 1 ) {return testSquares(k-1,b)}

}

function testFor(i){
    if( Math.abs(x1-maze[i].x)==sizeSquare && Math.abs(y1-maze[i].y)==sizeSquare ) {return false}  
    else if( Math.abs(y1-maze[i].y)==sizeSquare && x1==maze[i].x) {return false; }
    else if( Math.abs(x1-maze[i].x)==sizeSquare && y1==maze[i].y) {return false; }
    else if( x1==maze[i].x && y1==maze[i].y) { return false; }
    else {return true}
}

function testSquares(a,b){
    let i;
    for (i=0; i<maze.length; i++){

        if (i==b ){
            if( Math.abs(y1-maze[i].y)==sizeSquare && x1==maze[i].x){ return false;}
            else if( Math.abs(x1-maze[i].x)==sizeSquare && y1==maze[i].y){ return false;}}
            
                        
        else if (i!= a && i!= b){
            if (!testFor(i)) {
                 return false;
            }        
    }}
    counter=0; return true;                                         
}

function firstTestSquares(a,b,c){
    let i;
    for (i=0; i<maze.length; i++){

        if (i!= a && i!= b && i!=c){
            if (!testFor(i)) {
                 return false;
            }
        }}
    counter++; return true;
}

function randomDirectionTest(a,b,direction,position){
    if(k==maze.length){x1=maze[k-1].x+a; y1=maze[k-1].y+b;}
    else{x1=maze[k].x+a; y1=maze[k].y+b;}
        
    if ((0<=x1) && (x1<=endWidth-sizeSquare) && (0<=y1) && (y1<=endHeight-sizeSquare) && direction.value ){

        if (testCounter()) {
            position.value = true; controlSpeed++; maze.push({x:x1, y:y1}); k=maze.length; 
        }else{ direction.value = false ;} //randomDirection=Math.floor(Math.random()*4);
                
    }else{ direction.value = false ; }//randomDirection=Math.floor(Math.random()*4);


}
//I didn't declared x and y and everything in maze Generator is working without any error !!!!

function mazeGenerator(){
    controlSpeed=0;
    position={value:true};

    if (k==undefined){
        maze.push({x:(Math.floor(Math.random()*36)+1)*sizeSquare, y:(Math.floor(Math.random()*20)+1)*sizeSquare});
        k=maze.length;
    
    }else {
        while (!position.value || controlSpeed<speed){
            if(position.value){
                left={value: true}; right={value: true}; up={value: true}; down={value: true};
            }
            position.value = false;
            randomDirection=Math.floor(Math.random()*4);// if i remove it from here and i put it just in the else condition of the function randomDirectionTest it will be another type of maze
            if (!right.value && !left.value && !up.value && !down.value){
                if (k>1){
                    if(counter==0 ){if (k==maze.length){k-=2;}else{k--;}; a=k+1; b=k; c=k-1;}
                    else if (counter==1){k-=2; counter=0;; a=k+1; b=k; c=k-1;}
    
                }
                else {position.value=true; randomG=false,controlSpeed=speed}
                left={value: true}; right={value: true}; up={value: true}; down={value: true};
            }
            else if (randomDirection==0){ randomDirectionTest(sizeSquare,0,right,position);
    
            }else if (randomDirection==1 ){ randomDirectionTest(-sizeSquare,0,left,position);
                
            }else if (randomDirection==2){ randomDirectionTest(0,-sizeSquare,up,position);
    
            }else if (randomDirection==3){ randomDirectionTest(0,sizeSquare,down,position);}
        }
    }
}
///////////////////////////////////****************///////////////////////////////////
/***********************************PathFinder*****************************************/

function verifyPositionLocation(x,y){
    if(finalLocation.x==x && finalLocation.y==y){
        return true;
    
    }else{
        for (let i =0; i<maze.length; i++){
            if (maze[i].x==x && maze[i].y==y){
                return true;
            }}
    }
    return false ;
}

function correctDirection(i){

    let left=false, right=false, up=false, down=false;
    let cross = 0, x1=path[i].x, y1=path[i].y, lengthCross;
    let resultOfChangeRoad;

    if (verifyPositionLocation(x1+sizeSquare, y1)){
        if (i!=0){
            if (x1+sizeSquare != path[i-1].x || y1 != path[i-1].y){
                if (crossRoad.length>0){
                    if (x1+sizeSquare != crossRoad[crossRoad.length-1].x || y1 != crossRoad[crossRoad.length-1].y ){
                        right = true; cross++;
                    }
                }else {
                    right = true; cross++;
                }
            } 
        }else {right = true; cross++}}

    if (verifyPositionLocation(x1-sizeSquare, y1)){
        if (i!=0){
            if (x1-sizeSquare != path[i-1].x || y1 != path[i-1].y){
                if (crossRoad.length>0){
                    if (x1-sizeSquare != crossRoad[crossRoad.length-1].x || y1 != crossRoad[crossRoad.length-1].y ){
                        left = true; cross++;
                    }
                }else {
                    left = true; cross++;
                } 
            }
        }else {left = true; cross++}}

    if (verifyPositionLocation(x1, y1-sizeSquare)){
        if (i!=0){
            if (x1 != path[i-1].x || y1-sizeSquare != path[i-1].y){
                if (crossRoad.length>0){
                    if (x1 != crossRoad[crossRoad.length-1].x || y1-sizeSquare != crossRoad[crossRoad.length-1].y ){
                        up = true; cross++;
                    }
                }else {
                    up = true; cross++;
                } 
            } 
        }else {up = true; cross++}}

    if (verifyPositionLocation(x1, y1+sizeSquare)){
        if (i!=0){
            if ( x1 != path[i-1].x || y1+sizeSquare != path[i-1].y ){
                if (crossRoad.length>0){
                    if (x1 != crossRoad[crossRoad.length-1].x || y1+sizeSquare != crossRoad[crossRoad.length-1].y ){
                        down = true; cross++;
                    }
                }else {
                    down = true; cross++;
                } 
            } 
        }else {down = true; cross++}}

    if (cross>=2){
        crossRoad.push({p:i, x:path[i].x, y:path[i].y, r:right, l:left, u:up, d:down});
        
        while (crossRoad.length > 0){
            
            lengthCross = crossRoad.length-1;
            i=crossRoad[lengthCross].p;
            x1=path[i].x; y1=path[i].y;
            resultOfChangeRoad = changeRoads(lengthCross, x1,y1);
            
            for(let h=path.length-2; h>i; h--){
                falsePath.push(path[h]);
                path.splice(h,1);
            }
            if ( !resultOfChangeRoad ){

                if(!crossRoad[lengthCross].r && !crossRoad[lengthCross].l && !crossRoad[lengthCross].u && !crossRoad[lengthCross].d){
                    crossRoad.pop();             
                }else {
                    if ( crossRoad[lengthCross].r) {crossRoad[lengthCross].r=false; return {x:x1+sizeSquare, y:y1};}
                    else if ( crossRoad[lengthCross].l) {crossRoad[lengthCross].l=false; return {x:x1-sizeSquare, y:y1};}
                    else if ( crossRoad[lengthCross].u) {crossRoad[lengthCross].u=false; return {x:x1, y:y1-sizeSquare};}
                    else if ( crossRoad[lengthCross].d) {crossRoad[lengthCross].d=false; return {x:x1, y:y1+sizeSquare};}} 
            
            }else {
                return resultOfChangeRoad;
            }          
        }
        if (crossRoad.length == 0 ){return {x:-1}}

    }else {
        if ( right) {return {x:x1+sizeSquare, y:y1};}
        else if ( left) {return {x:x1-sizeSquare, y:y1};}
        else if ( up) {return {x:x1, y:y1-sizeSquare};}
        else if ( down) {return {x:x1, y:y1+sizeSquare};}
        else {
            while (crossRoad.length > 0){
                
                lengthCross = crossRoad.length-1;
                i=crossRoad[lengthCross].p;
                x1=path[i].x; y1=path[i].y;
                resultOfChangeRoad = changeRoads(lengthCross, x1,y1)

                for(let h=path.length-2; h>i; h--){
                    falsePath.push(path[h]);
                    path.splice(h,1);
                }
                if ( !resultOfChangeRoad ){

                    if(!crossRoad[lengthCross].r && !crossRoad[lengthCross].l && !crossRoad[lengthCross].u && !crossRoad[lengthCross].d){
                        crossRoad.pop();
                    }else {
                        if ( crossRoad[lengthCross].r) {crossRoad[lengthCross].r=false; return {x:x1+sizeSquare, y:y1};}
                        else if ( crossRoad[lengthCross].l) {crossRoad[lengthCross].l=false; return {x:x1-sizeSquare, y:y1};}
                        else if ( crossRoad[lengthCross].u) {crossRoad[lengthCross].u=false; return {x:x1, y:y1-sizeSquare};}
                        else if ( crossRoad[lengthCross].d) {crossRoad[lengthCross].d=false; return {x:x1, y:y1+sizeSquare};}} 
                
                }else {
                    return resultOfChangeRoad;
                }   
            }
            if (crossRoad.length == 0  ){return {x:-1}}
        }
    }       
}

function changeRoads(lengthCross, x1,y1){
    if ( crossRoad[lengthCross].r && Math.abs(x1+sizeSquare - finalLocation.x) < Math.abs(x1 - finalLocation.x)  ){
        crossRoad[lengthCross].r = false; return {x:x1+sizeSquare, y:y1};

    }else if ( crossRoad[lengthCross].u && Math.abs(y1-sizeSquare - finalLocation.y) < Math.abs(y1 - finalLocation.y)  ){
        crossRoad[lengthCross].u = false; return {x:x1, y:y1-sizeSquare};
    
    }else if ( crossRoad[lengthCross].l && Math.abs(x1-sizeSquare - finalLocation.x) < Math.abs(x1 - finalLocation.x)  ){
        crossRoad[lengthCross].l = false; return {x:x1-sizeSquare, y:y1};
    
    }else if ( crossRoad[lengthCross].d && Math.abs(y1+sizeSquare - finalLocation.y) < Math.abs(y1 - finalLocation.y)  ){
        crossRoad[lengthCross].d = false; return {x:x1, y:y1+sizeSquare};
    }
    else {return false ;}
}

function pathFinder(){
    let i,addition=false;
    controlSpeed=0;

    while (pathfinder && (!addition || controlSpeed<speed)){
        i=path.length-2; addition = false;
        if(path[i].y==path[path.length-1].y && path[i].x==path[path.length-1].x ){
            path.pop();
            pathfinder=false;

        }else {path.push (correctDirection(i)); addition = true;controlSpeed++;}
        if (path[path.length-1].x == -1 ){ path=[startLocation, finalLocation]; pathfinder=false;
        }else if (addition==true) {path.splice(path.length-2,1);path.push(finalLocation);}
    }
}

//////////////////////////////////*****************///////////////////////////////////
/*********************************PathFinder without randomMazeGenerator***************************************/

function verifyPositionLocation2(x,y){
    if(finalLocation.x==x && finalLocation.y==y){
        return true;
    
    }else{
        for (let i =0; i<state.length; i++){
            if (state[i].x==x && state[i].y==y){
                return false;
            }}
    }
    for (let i =0; i<path.length-1; i++){
        if (path[i].x==x && path[i].y==y){
            return false;
    }}
    if(x>endWidth-sizeSquare ||x<0 || y<0 ||y>endHeight-sizeSquare){return false}   
    return true ;
}
function testTouch(x,y){
    for (let i =0; i<state.length; i++){
        if (state[i].x==x && Math.abs(y -state[i].y)==sizeSquare){
            return true;
        }else if(state[i].y==y && Math.abs(x -state[i].x)==sizeSquare){
            return true;
        }else if(Math.abs(x -state[i].x)==sizeSquare && Math.abs(y -state[i].y)==sizeSquare){
            return true;
        }
    }
    return false;
}

function pushPop(x1,y1){
    path.pop();path.push({x:x1, y:y1}); path.push({x:finalLocation.x, y:finalLocation.y});
    return true;
}
function PathFinder2(){
    controlSpeed=0;
    k=path.length-2; 
    let x1, y1;
    let position = false;

    while(!position || controlSpeed<speed){

        left=false; right=false; up=false; down=false; 
        x1=path[k].x, y1=path[k].y;

        if(verifyPositionLocation2(x1+sizeSquare, y1)){right=true}
        if(verifyPositionLocation2(x1-sizeSquare, y1)){left=true}
        if(verifyPositionLocation2(x1, y1-sizeSquare)){up=true}
        if(verifyPositionLocation2(x1, y1+sizeSquare)){down=true}

        if (Math.abs(x1+sizeSquare - path[k+1].x) < Math.abs(x1 - path[k+1].x) && right )     {position = pushPop(x1+sizeSquare,y1);}
        else if(Math.abs(x1-sizeSquare - path[k+1].x) < Math.abs(x1 - path[k+1].x) && left )  {position = pushPop(x1-sizeSquare,y1);}
        else if (Math.abs(y1-sizeSquare - path[k+1].y) < Math.abs(y1 - path[k+1].y) && up )   {position = pushPop(x1,y1-sizeSquare);}
        else if (Math.abs(y1+sizeSquare - path[k+1].y) < Math.abs(y1 - path[k+1].y) && down ) {position = pushPop(x1,y1+sizeSquare);}
        else{

            if (right && testTouch(x1+sizeSquare,y1))       {position = pushPop(x1+sizeSquare,y1);}
            else if (left && testTouch(x1-sizeSquare,y1))   {position = pushPop(x1-sizeSquare,y1);}
            else if(up && testTouch(x1,y1-sizeSquare))      {position = pushPop(x1,y1-sizeSquare);}
            else if (down && testTouch(x1,y1+sizeSquare))   {position = pushPop(x1,y1+sizeSquare);}
            else{
                if (right )     {position = pushPop(x1+sizeSquare,y1);}
                if (left )      {position = pushPop(x1-sizeSquare,y1);}
                if(up )         {position = pushPop(x1,y1-sizeSquare);}
                if (down )      {position = pushPop(x1,y1+sizeSquare);}
            }
        }
        if(!position){if (k>0) {k--;x1=path[k].x; y1=path[k].y} else {position=true; finder=false;}}
        else {
            if(path[path.length-2].x==finalLocation.x && path[path.length-2].y==finalLocation.y){finder=false;path.pop(); controlSpeed=speed;  
            }else{
                controlSpeed++;
                k=path.length-2; 
            }
        }
    } 
}

//////////////////////////////////****************///////////////////////////////////

function drawschema(){

    for(let i=0; i<endHeight; i+=sizeSquare){
        for(let j=0; j<endWidth; j+=sizeSquare){
            if (randomG || randomMaze){
                drawSquare(j,i,sizeSquare,'black','black',0.5);
            }else {
                drawSquare(j,i,sizeSquare,'white','DarkSlateGrey',0.5);
            }
        }
    }

    if (maze.length > 0 ){
        for(let i=0; i<maze.length; i++){
            drawSquare(maze[i].x,maze[i].y,sizeSquare,'white','DarkSlateGrey',0.5);
        }
    }
    if (startLocation){drawSquare(startLocation.x, startLocation.y, sizeSquare,'red','black',2);if(path.length==0){path.push(startLocation);}}
    if (finalLocation){drawSquare(finalLocation.x, finalLocation.y, sizeSquare,'green','black',2);if(path.length==1){path.push(finalLocation);}}


    if (state.length > 0 ){
        for(let i=0; i<state.length; i++){
            drawSquare(state[i].x,state[i].y,sizeSquare,'black','black');
        }
    }
    if (path.length > 0){
        for(let i=1; i<path.length-1; i++){
                drawSquare(path[i].x,path[i].y,sizeSquare,'aqua','black',0.5);
        }
    }
    if (falsePath.length > 0 ){
        for(let i=0; i<falsePath.length; i++){
            drawSquare(falsePath[i].x,falsePath[i].y,sizeSquare,'aqua','black',0.5);
        }
    }
    if(randomMaze && !pathfinder){
        controlSpeed=0;
        while(path.length>2 && controlSpeed<speed){
            correctPath.push(path[path.length-2]);
            path.splice(path.length-2,1);
            controlSpeed++;
        }
    }
    if (correctPath.length > 0 ){
        for(let i=0; i<correctPath.length; i++){
            drawSquare(correctPath[i].x,correctPath[i].y,sizeSquare,'yellow','black',1); 
        }
    }

}

function renderGame() {

    // Clear screen
    clearScreen();
    // Draw game
    if (randomG){
        mazeGenerator();
        randomMaze = true;
    }
    if(pathfinder){
        pathFinder();
    }
    if(finder){
        PathFinder2();
    }
    drawschema();
    
}

function gameLoop() {
    // Main game
    renderGame();

    // End calls
    window.requestAnimationFrame(gameLoop);
}

function checkMaze(pos){
    for (let i =0; i<maze.length; i++){
        if (maze[i].x==mouseX && maze[i].y==mouseY){

            if(pos==state) {pos.push({x:mouseX , y:mouseY});}
            else if(pos==startLocation) {startLocation={x:mouseX , y:mouseY};}
            else {finalLocation={x:mouseX , y:mouseY};}
            
            maze.splice(i,1);
            return true;
        }
    }
}
function mousePosition(){

    if(mouseX>=0 && mouseX<=endWidth-1 && mouseY>=0 && mouseY<=endHeight-1){
        
        mouseX = Math.floor(mouseX);
        mouseY = Math.floor(mouseY);
    
        while (mouseX % sizeSquare !=0){
            mouseX -- ;
        }
        while (mouseY % sizeSquare !=0){
            mouseY -- ;
        }

        if(!startLocation){
            if(randomMaze){checkMaze(startLocation);}
            else{startLocation={x:mouseX, y:mouseY};}
        }

        else if(!finalLocation){ 
            if(randomMaze){checkMaze(finalLocation);}
            else{
                if(mouseX!=startLocation.x || mouseY!=startLocation.y){finalLocation={x:mouseX, y:mouseY};}}
            }

        else if (state.length>0){
            for(let i=0; i<state.length; i++){
                if((state[i].x==mouseX && state[i].y==mouseY) || (mouseX==startLocation.x && mouseY==startLocation.y) || (mouseX==finalLocation.x && mouseY==finalLocation.y)){
                    mouseX=undefined; mouseY=undefined;
                    return false;
                }
            }
            if(randomMaze ){
                checkMaze(state);
            }
            else{if( (mouseX!=startLocation.x || mouseY!=startLocation.y) && (mouseX!=finalLocation.x || mouseY!=finalLocation.y)){state.push({x:mouseX , y:mouseY});}}
        
        }else{
            if(randomMaze){
                checkMaze(state);
            }
            else{if( (mouseX!=startLocation.x || mouseY!=startLocation.y) && (mouseX!=finalLocation.x || mouseY!=finalLocation.y)){state.push({x:mouseX , y:mouseY});}}  }
    }
    

    mouseX=undefined ; mouseY=undefined;
}
function main() {
    // Set canvas width & height automatically
    setCanvasSize();
    window.addEventListener('resize', () => {
        setCanvasSize();
    })

    document.addEventListener('mousedown', (e) => {
        if(!randomG){
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            mousePosition();
            isMouseDown=true;
        }
    })
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    document.addEventListener('mousemove', (e) => {
        if(isMouseDown){
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            // Calculate mouse position relative to the canvas
            mousePosition();
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key){
            case 'r': state.length =0, maze.length=0, path.length=0,correctPath.length=0, falsePath.length=0,pathfinder=false,finder=false; randomG=false, randomMaze=false, k=undefined, startLocation=undefined, finalLocation=undefined ; break;
            case 'g': if( state.length==0 && !startLocation && !finalLocation){randomG = true}; break;
            case 'f':   if (startLocation && finalLocation && randomMaze){pathfinder = true;}
                        else if (startLocation && finalLocation && !randomMaze && !pathfinder){finder=true;}; break;
        }
    })
    


    // Run game
    window.requestAnimationFrame(gameLoop)
}

/****Main call*****/
main();
