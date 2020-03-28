var w=60 ;
var canvas = document.getElementById("canvasGame") ;
var context = canvas.getContext("2d") ;
var cols = Math.floor(canvas.width/w) ;
var FPS=30 ;
var grid=new Array(cols) ;
var img=document.getElementById("img") ;
var img1=document.getElementById("img1") ;
var event ;
//var maxW =Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth );
var xoffset=canvas.offsetLeft
var yoffset=canvas.offsetTop ;
var nbmines = 0 ;
var sc = document.getElementById("sc") ;
var res = document.getElementById("res") ;
var mousex ;
var mousey ;
var game ;
 ;
//our cell object
class Cell {
    constructor(x,y) {
        this.x=x ;
        this.y=y ;
        this.mine = Math.floor(Math.random() *6 ) < 1;
    }
    revealed =false ;
    countMine =0 ;
    signed =false ;
}
function playGame() {
    setInterval(reinit,1000/FPS) ;
    nbmines=0;
    document.getElementById("ten").setAttribute("onclick" , "");
    document.getElementById("twenty").setAttribute("onclick" , "");
    document.getElementById("fifteen").setAttribute("onclick" , "");

    for (let j = 0; j < cols; j++) {
    grid[j] = new Array(cols);
}
game =setInterval(show , 1000/FPS) ;
setInterval(verifyWin , 1000/FPS);
//setting the grid
for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
        grid[i][j] = new Cell(Math.floor(i*w+w/2) ,Math.floor(j*w+w/2) );
    }
}
//counting the number of mines
for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
        if(grid[i][j].mine) nbmines++;
        console.log(nbmines);
    }
}
sc.innerHTML=nbmines.toString();
countMines() ;
}

//count the number of every bees in proximity
function countMines() {

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
            let s=0;
            if (grid[i][j].mine) grid[i][j].countMine=-1  ;
            else {
                for (let a = -1; a <= 1; a++) {
                    for (let b = -1; b <= 1; b++) {
                        if (a+i >= 0 && a+i<cols && b+j>=0 && b+j<cols)
                            if(grid[i+a][j+b].mine) grid[i][j].countMine++ ;
                    }
                }
            }

        }
    }
}

//get mouse coordinate
function getCoordinate(e) {
    let x = e.clientX;
    let y = e.clientY;
    console.log(e.clientX + "/" + e.clientY);
    mousex = Math.floor((x-xoffset)/w ) ;
    mousey = Math.floor((y-yoffset)/w);
    if(grid[mousex][mousey].mine)
        loose() ;
    else
        reveal(mousex,mousey);
}

//reveal function
function reveal(i,j) {
    if(!grid[i][j].revealed) {
        grid[i][j].revealed = true;
        if (grid[i][j].countMine === 0)
            revealOthers(i, j);
    }
}

//reveal others function : will reveal every cell empty
function revealOthers(i,j) {
    for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
            if (a + i >= 0 && a + i < cols && b + j >= 0 && b + j < cols)
                reveal(a+i, b+j);
        }
    }
}

//right click button
function signalIt(e) {
    let x = e.clientX;
    let y = e.clientY;
    console.log(e.clientX + "/" + e.clientY);
    mousex = Math.floor((x-xoffset)/w ) ;
    mousey = Math.floor((y-yoffset)/w);
    if(!grid[mousex][mousey].signed) {
        grid[mousex][mousey].signed = true;
        if(parseInt(sc.innerHTML)>0)
            sc.innerHTML = (parseInt(sc.innerHTML) - 1).toString();
    }
    else {
        grid[mousex][mousey].signed = false;
        if(parseInt(sc.innerHTML)<nbmines)
            sc.innerHTML = (parseInt(sc.innerHTML) + 1).toString();
    }
    e.preventDefault();
}

//loose function
function loose() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].revealed=true;
        }
    }
    res.innerHTML="You Lost  &#128541 &#128541 ! try again ! ";
    res.style.backgroundColor = "#d63447" ;
}
//displaying the grid function
function show() {
    context.fillStyle = "#393e46";
    context.fillRect(0, 0, canvas.width , canvas.height);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
            context.strokeStyle = "white";
            context.strokeRect(i * w, j * w, w, w);
            if (grid[i][j].signed){
                context.drawImage(img1, grid[i][j].x - w / 3, grid[i][j].y - w / 3, Math.floor(2*w/3), Math.floor(2*w/3));
            }
            else if (grid[i][j].revealed) {
                if (grid[i][j].mine) {
                    context.drawImage(img, grid[i][j].x - w / 3, grid[i][j].y - w / 3, Math.floor(2*w/3), Math.floor(2*w/3));
                } else {
                    let a=grid[i][j].countMine ;
                    if (a===0)
                    {
                        context.fillStyle="#eeeeee" ;
                        context.fillRect(grid[i][j].x-w/2, grid[i][j].y-w/2, w , w);
                    }
                    else {
                        context.fillStyle = "#00adb5";
                        context.font = w+ "px Bold";
                        context.fillText(grid[i][j].countMine.toString(), grid[i][j].x - w/3, grid[i][j].y + w/3);
                    }
                }
            }
        }
    }

}

//verifying if the player won or not
function verifyWin() {
    let s=0;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j].mine && grid[i][j].signed) s++;
        }
    }
    if (s===nbmines) win() ;
}

//the win function
function win() {
    res.innerHTML="WoW ! Very Good Player ! You won.";
    res.style.backgroundColor = "#6A2C70" ;
    game.clearInterval();
}

//radio buttons function
function setW(n) {
    w=n ;
     cols = Math.floor(canvas.width/w) ;
}

//reinitializing function every time maybe the user change the screen size
function reinit() {
   maxW =Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth );
    xoffset=canvas.offsetLeft ;
    yoffset=canvas.offsetTop;
}