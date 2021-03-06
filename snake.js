const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');




//body:1, food:2
context.scale(10,10);

const color = ['black', 'green', 'blue', 'yellow'];
const player = {
    arena: null,
    deque: null,
    direction: null,
    score: 0,
    ice_cream: 0,
    ice_creamPos:null
}

let dropCounter = 0;
let dropInterval = 50;
let lastTime = 0;

function update(time = 0){
    const deltaTime = time - lastTime;
    dropCounter += deltaTime;
    if(dropCounter > dropInterval){
        makeMove();
        dropCounter = 0;
    }
    if(player.ice_cream > 0){
        player.ice_cream =  Math.floor(player.ice_cream - 0.01 * deltaTime);
        if(player.ice_cream <= 0){
            player.ice_cream = 0;
            player.arena[player.ice_creamPos[0]][player.ice_creamPos[1]] = 0;
            player.ice_creamPos = null;
        }
    }
    lastTime = time;
    drawArena();
    requestAnimationFrame(update);
}

function makeMove(){
    let rl = player.arena.length;
    let cl = player.arena[0].length;
    let head = player.deque[player.deque.length - 1];
    let newHead = [head[0] + player.direction[0], head[1] + player.direction[1]]
    if(newHead[0] < 0){
        newHead[0] = rl - 1;
    }else if(newHead[0] == rl){
        newHead[0] = 0;
    }else if(newHead[1] == cl){
        newHead[1] = 0;
    }else if(newHead[1] < 0){
        newHead[1] = cl - 1;
    }
    if(player.arena[newHead[0]][newHead[1]] != 2 && player.arena[newHead[0]][newHead[1]] != 3){
        let tail = player.deque.shift();
        player.arena[tail[0]][tail[1]] = 0;
    }
    if(player.arena[newHead[0]][newHead[1]] == 1){
        alert('Game Over');
        resetGame();
        update();
        updateScore();
    }else if(player.arena[newHead[0]][newHead[1]] == 2){
        generateRandomFood();
        player.score += 100;
        updateScore();
    }else if(player.arena[newHead[0]][newHead[1]] == 3){
        player.score += player.ice_cream
        player.ice_cream = 0;
        player.ice_creamPos = null;
        updateScore()
    }
    player.deque.push(newHead);
    player.arena[newHead[0]][newHead[1]] = 1;
}

function resetGame(){
    createMatrix(40,40);
    initializePlayer();
    player.score = 0;
    player.ice_cream = 0;
    player.ice_creamPos = null
    if(player.deque[0][1] > 8){
        player.deque.unshift([player.deque[0][0],player.deque[0][1] - 1 ])
        player.direction = [0,1];
    }else{
        player.direction = [0,-1];
        player.deque.unshift([player.deque[0][0] - 1,player.deque[0][1] + 1])
    }
    generateRandomFood();
}

function createMatrix(rl, cl){
    player.arena = [];
    for(let i = 0; i < rl; i ++){
        player.arena.push(new Array(cl).fill(0));
    }
}

function initializePlayer(){
    let rl = player.arena.length;
    let cl = player.arena[0].length;
    let x = Math.floor(Math.random() * rl);
    let y = Math.floor(Math.random() * cl);
    player.arena[x][y] = 1;
    player.deque = [[x,y]];
}

function generateRandomFood(){
    let rl = player.arena.length;
    let cl = player.arena[0].length;
    let temp = []
    for(let i = 0; i < rl; ++i){
        for(let j = 0; j < cl; ++j){
            if(player.arena[i][j] === 0){
                temp.push([i,j]);
            }
        }
    }
    if(temp.length == 0) {
        alert(`You Win!\n You score is ${player.score}`);
        resetGame();
        update();
        updateScore();
        return;
    }
    let food = Math.floor(Math.random() * temp.length);
    let [x, y] = temp[food];
    player.arena[x][y] = 2;
    if(temp.length > 1 && Math.random() < 0.2 && player.ice_creamPos == null){
        temp.slice(food, 1);
        [x, y] = temp[Math.floor(Math.random() * temp.length)];
        player.arena[x][y] = 3;
        player.ice_cream = 300;
        player.ice_creamPos = [x,y];
    }
    //[x, y] = [Math.floor(Math.random() * rl),Math.floor(Math.random() * cl)];
}

function drawArena(){
    context.fillStyle = '#000';
    context.fillRect(0,0, canvas.height,canvas.width);
    let rl = player.arena.length;
    let cl = player.arena[0].length;
    for(let i = 0; i < rl; i++){
        for(let j = 0; j < cl; j++){

                context.fillStyle = color[player.arena[i][j]];
                context.fillRect(j, i,1,1);

        }
    }
    updateIce_cream();
}

function updateIce_cream(){
    if(player.ice_creamPos == null){
        document.getElementById('ice_cream').innerText = null;
    }else
        document.getElementById('ice_cream').innerText = `Ice-Cream: ${player.ice_cream}`;
}


function playerMove(x,y){
    let rl = player.arena.length;
    let cl = player.arena[0].length;
    let cur = player.deque[player.deque.length - 1];
    let pre = player.deque[player.deque.length - 2];
    let dx = cur[0] - pre[0];
    let dy = cur[1] - pre[1];
    if(dx == rl - 1){
        if(!(x == 1 && y == 0)){
            player.direction = [x,y];
        }
    }else if(dx == 1 - rl){
        if(!(x == -1 && y == 0)){
            player.direction = [x,y];
        }
    }else if(dy == cl - 1){
        if(!(x == 0 && y == 1)){
            player.direction = [x,y];
        }
    }else if(dy == 1 - cl){
        if(!(x == 0 && y == -1)){
            player.direction = [x,y];
        }
    } else if(x + dx != 0 || y + dy != 0){
        player.direction = [x,y];
    }
}

document.addEventListener('keydown', event =>{
    if (event.keyCode == 40){
        playerMove(1,0);
    }else if(event.keyCode == 39){
        playerMove(0,1);
    }else if(event.keyCode == 37){
        playerMove(0,-1);
    }else if(event.keyCode == 38){
        playerMove(-1,0);
    }
});

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

resetGame();
update();
updateScore();