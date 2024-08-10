/******CONSTANTS*******/
const canvas = getCanvas();
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();//get the canva's bounding rectangle
const sizeSquare = 25;

const state = [];
let mouseX, mouseY, startWidth=0, startHeight=0, endWidth=0, endHeight=0, isMouseDown=false;

let maze=[], left, right, up, down, position, randomDirection, counter=0, k; 
let randomG =false, randomMaze=false ;


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

function drawSquare(x, y, size, fill,border) {
    ctx.fillStyle = fill;
    ctx.lineWidth= 0.5 ;
    ctx.strokeStyle = border;
    ctx.fillRect(x, y, size, size);
    ctx.strokeRect(x,y,size,size);
}

/*************************************MazeGenerator***********************************/
function testCounter(bool){
    if ( k>=2 && counter == 0 && k==maze.length &&  (x1==maze[k-2].x && y1==maze[k-2].y) ){bool.value = false ; randomDirection=Math.floor(Math.random()*4); return false}
    else if ((counter ==0 || counter==2) && k==maze.length){ return testSquares(k-1,k-2,bool); }

    else if(counter == 0 && k!=maze.length && ((x1==maze[a].x && y1==maze[a].y) || (x1==maze[c].x && y1==maze[c].y)) ){bool.value = false ; randomDirection=Math.floor(Math.random()*4); return false}
    else if (counter==0 && k!=maze.length) {return firstTestSquares(a,b,c,bool)}

    else if (counter == 1 && (x1==maze[b].x && y1==maze[b].y) ){bool.value = false ; randomDirection=Math.floor(Math.random()*4); return false}
    else if (counter == 1 ) {return testSquares(k-1,b,bool)}

}

function testFor(i){
    if( Math.abs(x1-maze[i].x)==sizeSquare && Math.abs(y1-maze[i].y)==sizeSquare ) {return false}  
    else if( Math.abs(y1-maze[i].y)==sizeSquare && x1==maze[i].x) {return false; }
    else if( Math.abs(x1-maze[i].x)==sizeSquare && y1==maze[i].y) {return false; }
    else if( x1==maze[i].x && y1==maze[i].y) { return false; }
    else {return true}
}

function testSquares(a,b,direction){
    let i;
    for (i=0; i<maze.length; i++){

        if (i==b ){
            if( Math.abs(y1-maze[i].y)==sizeSquare && x1==maze[i].x){randomDirection=Math.floor(Math.random()*4); direction.value=false; break;}
            else if( Math.abs(x1-maze[i].x)==sizeSquare && y1==maze[i].y){randomDirection=Math.floor(Math.random()*4); direction.value=false; break;}}
            
                        
        else if (i!= a && i!= b){
            if (!testFor(i)) {
                randomDirection=Math.floor(Math.random()*4); direction.value=false; break;
            }        
    }}
    if(i==maze.length){counter=0;return true}                                         
    else {return false;}
}

function firstTestSquares(a,b,c,direction){
    let i;
    for (i=0; i<maze.length; i++){

        if (i!= a && i!= b && i!=c){
            if (!testFor(i)) {
                randomDirection=Math.floor(Math.random()*4); direction.value=false; break;
            }
        }}
    if (i==maze.length){counter++;return true}
    else {return false;}
}

function randomDirectionTest(a,b,direction,position){
    if(k==maze.length){x1=maze[k-1].x+a; y1=maze[k-1].y+b;}
    else{x1=maze[k].x+a; y1=maze[k].y+b;}
        
    if ((startWidth<=x1) && (x1<=endWidth-sizeSquare) && (startHeight<=y1) && (y1<=endHeight-sizeSquare) && direction.value ){

        if (testCounter(direction)) {
            position.value = true; maze.push({x:x1, y:y1}); k=maze.length; }
                
    }else{ direction.value = false ; randomDirection=Math.floor(Math.random()*4);}


}

function mazeGenerator(){
    randomDirection=Math.floor(Math.random()*4),position={value:false};
    left={value: true}, right={value: true}, up={value: true}, down={value: true};
    if (k==undefined){
        maze.push({x:((Math.floor(Math.random()*36)+1)*sizeSquare)+startWidth, y:((Math.floor(Math.random()*20)+1)*sizeSquare)+startHeight});
        k=maze.length;
    }
    else {
        while (!position.value){
            if (!right.value && !left.value && !up.value && !down.value){
                if (k>1){
                    if(counter==0 ){if (k==maze.length){k-=2;}else{k--;}; a=k+1; b=k; c=k-1;}
                    else if (counter==1){k-=2; counter=0;; a=k+1; b=k; c=k-1;}
    
                }
                else {position.value=true; randomG=false}
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
    }
    else{
        for (let i =0; i<maze.length; i++){
        if (maze[i].x==x && maze[i].y==y){
            return true;
        }
    }
    return false ;
    }
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
                }
                else {
                    right = true; cross++;
                }
            } 
        }
        else {right = true; cross++}}

    if (verifyPositionLocation(x1-sizeSquare, y1)){
        if (i!=0){
            if (x1-sizeSquare != path[i-1].x || y1 != path[i-1].y){
                if (crossRoad.length>0){
                    if (x1-sizeSquare != crossRoad[crossRoad.length-1].x || y1 != crossRoad[crossRoad.length-1].y ){
                        left = true; cross++;
                    }
                }
                else {
                    left = true; cross++;
                } 
            }
        }
        else {left = true; cross++}}

    if (verifyPositionLocation(x1, y1-sizeSquare)){
        if (i!=0){
            if (x1 != path[i-1].x || y1-sizeSquare != path[i-1].y){
                if (crossRoad.length>0){
                    if (x1 != crossRoad[crossRoad.length-1].x || y1-sizeSquare != crossRoad[crossRoad.length-1].y ){
                        up = true; cross++;
                    }
                }
                else {
                    up = true; cross++;
                } 
            } 
        }
        else {up = true; cross++}}

    if (verifyPositionLocation(x1, y1+sizeSquare)){
        if (i!=0){
            if ( x1 != path[i-1].x || y1+sizeSquare != path[i-1].y ){
                if (crossRoad.length>0){
                    if (x1 != crossRoad[crossRoad.length-1].x || y1+sizeSquare != crossRoad[crossRoad.length-1].y ){
                        down = true; cross++;
                    }
                }
                else {
                    down = true; cross++;
                } 
            } 
        }
        else {down = true; cross++}}

    if (cross>=2){

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
                    if ( crossRoad[lengthCross].r) {crossRoad[lengthCross].r=false; return {x:x1+sizeSquare, y:y1};}
                    else if ( crossRoad[lengthCross].l) {crossRoad[lengthCross].l=false; return {x:x1-sizeSquare, y:y1};}
                    else if ( crossRoad[lengthCross].u) {crossRoad[lengthCross].u=false; return {x:x1, y:y1-sizeSquare};}
                    else if ( crossRoad[lengthCross].d) {crossRoad[lengthCross].d=false; return {x:x1, y:y1+sizeSquare};}} 
            
            }else {
                return resultOfChangeRoad;
            }
            
        }
        if (crossRoad.length == 0 ){return {x:-1}}
    }
    else {
        if ( right) {return {x:x1+sizeSquare, y:y1};}
        else if ( left) {return {x:x1-sizeSquare, y:y1};}
        else if ( up) {return {x:x1, y:y1-sizeSquare};}
        else if ( down) {return {x:x1, y:y1+sizeSquare};}
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

function changeRoads(lengthCross, x1,y1,i){
    if ( crossRoad[lengthCross].r && Math.abs(x1+sizeSquare - path[i+1].x) < Math.abs(x1 - path[i+1].x)  ){
        crossRoad[lengthCross].r = false; return {x:x1+sizeSquare, y:y1};

    }else if ( crossRoad[lengthCross].u && Math.abs(y1-sizeSquare - path[i+1].y) < Math.abs(y1 - path[i+1].y)  ){
        crossRoad[lengthCross].u = false; return {x:x1, y:y1-sizeSquare};
    
    }else if ( crossRoad[lengthCross].l && Math.abs(x1-sizeSquare - path[i+1].x) < Math.abs(x1 - path[i+1].x)  ){
        crossRoad[lengthCross].l = false; return {x:x1-sizeSquare, y:y1};
    
    }else if ( crossRoad[lengthCross].d && Math.abs(y1+sizeSquare - path[i+1].y) < Math.abs(y1 - path[i+1].y)  ){
        crossRoad[lengthCross].d = false; return {x:x1, y:y1+sizeSquare};
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
        else {path.push (correctDirection(i)); addition = true;}
    }
    if (path[path.length-1].x == -1 ){ path.pop(); pathfinder=false;}
    else if (addition==true) {path.splice(path.length-2,1)}
}

//////////////////////////////////*****************///////////////////////////////////

function drawschema(){
    let {width, height}=getCanvasSize();
    if(endWidth==0 && endHeight==0){
        
        while (width%sizeSquare !=0 ){width--;startWidth++;}
        startWidth = Math.floor(startWidth / 2)-1;
        endWidth = width + startWidth;
    
        while (height%sizeSquare !=0 ){height--; startHeight++;}
        startHeight = Math.floor(startHeight / 2)-1;
        endHeight = height + startHeight;
    }

    for(let i=startHeight; i<endHeight; i+=sizeSquare){
        for(let j=startWidth; j<endWidth; j+=sizeSquare){
            if (randomG || randomMaze){
                drawSquare(j,i,sizeSquare,'black','black');
            }else {
                drawSquare(j,i,sizeSquare,'white','aqua');
            }
        }
    }

    if (startLocation){drawSquare(startLocation.x, startLocation.y, sizeSquare,'red','red');if(path.length==0){path.push(startLocation);}}
    if (finalLocation){drawSquare(finalLocation.x, finalLocation.y, sizeSquare,'green','green');if(path.length==1 || pathfinder){path.push(finalLocation);}}


    if (maze.length > 0 ){
        for(let i=0; i<maze.length; i++){
            drawSquare(maze[i].x,maze[i].y,sizeSquare,'white','aqua');
        }
    }

    if (state.length > 0 ){
        for(let i=0; i<state.length; i++){
            drawSquare(state[i].x,state[i].y,sizeSquare,'black','black');
        }
    }
    if (path.length > 0){
        for(let i=0; i<path.length; i++){
            if(i!=0 && i!=path.length-1){
                drawSquare(path[i].x,path[i].y,sizeSquare,'aqua','black');
            }
        }
    }
    if (falsePath.length > 0 ){
        for(let i=0; i<falsePath.length; i++){
            drawSquare(falsePath[i].x,falsePath[i].y,sizeSquare,'aqua','black');
        }
    }
    if(randomMaze && !pathfinder){
        if(path.length>2){
            correctPath.push(path[path.length-2]);
            path.splice(path.length-2,1);
        }
    }
    if (correctPath.length > 0 ){
        for(let i=0; i<correctPath.length; i++){
            drawSquare(correctPath[i].x,correctPath[i].y,sizeSquare,'yellow','black'); 
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
            if(pos==state){
                pos.push({x:mouseX , y:mouseY});
            }
            else if(pos==startLocation) {startLocation={x:mouseX , y:mouseY};}
            else {finalLocation={x:mouseX , y:mouseY};}
            maze.splice(i,1);
            return true;
        }
    }
}

function mousePosition(){

    if(mouseX>=startWidth && mouseX<=endWidth-1 && mouseY>=startHeight && mouseY<=endHeight-1){
        
        mouseX = Math.floor(mouseX)-10;
        mouseY = Math.floor(mouseY)-10;
    
        while (mouseX % sizeSquare !=0){
            mouseX -- ;
        }
        while (mouseY % sizeSquare !=0){
            mouseY -- ;
        }
        mouseX+=startWidth; mouseY+=startHeight;

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
            if(randomMaze){
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
            case 'r': state.length =0, maze.length=0, path.length=0,falsePath.length=0,pathfinder=false, randomG=false, randomMaze=false, k=undefined, startLocation=undefined, finalLocation=undefined ; break;
            case 'g': if( state.length==0 && !startLocation && !finalLocation){randomG = true}; break;
            case 'f': if (startLocation && finalLocation){pathfinder = true;}; break;
        }
    })
    


    // Run game
    window.requestAnimationFrame(gameLoop)
}


/****Main call*****/
main();
