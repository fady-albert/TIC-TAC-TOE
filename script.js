// import HTML data
const main = document.querySelector('body');
const mode = document.getElementById('mode');
const icon = document.getElementById('icon');
const square = document.querySelectorAll('.square');
const start = document.getElementById('start');
const tPlayer = document.getElementById('2p');
const sPlayer = document.getElementById('bot');
const msg = document.getElementById('msg');
const again = document.getElementById('againD');
const againT = document.getElementById('winner');
const playAgain = document.getElementById('again');
const levelD = document.getElementById('level');
const backL = document.getElementById('back');
const mode1 = document.getElementById('easy');
const mode2 = document.getElementById('medium');
const mode3 = document.getElementById('hard');
const o = document.getElementById('o');
const x = document.getElementById('x');
const  pointCon = document.getElementById('points');

// js data
let dMode = localStorage.getItem('mode');
let t = 'o';
let gameOver = false;
let xWin = 0;
let oWin = 0;
let playMode = '2player';
let turn = 'user';

// audio
const winSound = new Audio("sounds/win.mp3");
const clickSound = new Audio("sounds/click.mp3");
const drawSound = new Audio("sounds/draw.mp3");
const loseSound = new Audio("sounds/lose.mp3");

// dark mode function
function dark() {
    main.classList.toggle('dark');
    mode.classList.toggle('active');
    icon.textContent = icon.textContent === 'light_mode' ? 'dark_mode' : 'light_mode';
};

// to check if user used to use dark mode
if (dMode === 'dark') {
    dark()
};

// change the game mode by click on the button
mode.addEventListener('click', () => {
    dark()
    localStorage.setItem('mode', main.className === 'dark' ? 'dark' : 'light'); // the main line to check the mode
});


// win
function win() {
    const patern = [
        // rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        // column
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        // cross
        [0, 4, 8],
        [2, 4, 6]
    ]

    // check if there is a winner
    for (let play of patern) {
        const [a, b, c] = play;

        if (square[a].textContent !== '' && square[a].textContent === square[b].textContent && square[b].textContent === square[c].textContent) {
            return square[a].textContent;
        }

    }

    return null;
};

// draw
function checkDraw() {
    for (let box of square) {
        if (box.textContent === '') {
            return false;
        }
    }

    return true;
}

// play sound function
function sound(sname) {
    sname.currentTime = 0;
    sname.play();
}

// show points
function points() {
    // add data
    o.textContent = oWin;
    x.textContent = xWin;
}

// action
function action() {
    const winner = win();

    if (winner) {
        gameOver = true; // to stop the game
        msg.textContent = '';

        if (playMode === '2player') {
            // play win sound
            sound(winSound)
        }
        else {
            if (winner === 'o') sound(winSound)
            else sound(loseSound)
        }

        // again display
        again.classList.add('show');
        pointCon.classList.remove('show');
        againT.textContent = winner + ' wins!'
        // points
        if (winner === 'o') {
            oWin++
        } else {
            xWin++
        }
        // save points
        points()
    }
    else if (checkDraw()) {
        gameOver = true; // to stop the game
        msg.textContent = ''
        // play draw sound
        sound(drawSound)
        // again display
        again.classList.add('show');
        pointCon.classList.remove('show');
        againT.textContent = "it's a draw";
    }
}

// main code
function twoPlayer() {
    square.forEach(box => {
        box.addEventListener('click', () => {

            // stop the game
            if (gameOver) return;

            // play click sound
            sound(clickSound)

            if (box.textContent === '') {
                // create HTML paragraph
                const p = document.createElement('p');
                p.textContent = t;

                // set the color to the text
                if (t === 'o') {
                    p.style.color = '#FF5656'
                } else {
                    p.style.color = '#6A7EFC'
                }
                // change t value
                t = t === 'o' ? 'x' : 'o'
                            
                msg.textContent = t + ' turn'

                // add data to HTML
                box.appendChild(p)
            };

            // validation
            action()

        });
    });
};

function easyMode() {
    if (turn !== 'bot' || t !== 'x' || gameOver) return;

    const empty = [...square].filter(box => box.textContent === '');
    if (empty.length === 0) return;
    const randomS = empty[Math.floor(Math.random() * empty.length)]

        // create HTML paragraph
        const p = document.createElement('p');
        p.textContent = t;

        // set the color to the text
        if (t === 'o') {
            p.style.color = '#FF5656'
        } else {
            p.style.color = '#6A7EFC'
        }

        setTimeout(() => {

            randomS.appendChild(p)
            sound(clickSound)
            
            // change t value
            t = t === 'o' ? 'x' : 'o'
            
            msg.textContent = t + ' turn'
            
            turn = 'user'
            
            action()

        }, 500);
}

function mediumMode() {
    setTimeout(() => {
        if (turn !== 'bot' || t !== 'x' || gameOver) return;

        // check win
        for (let i = 0; i < square.length; i++) {
            if (square[i].textContent === '') {
                // create HTML paragraph
                const p = document.createElement('p');
                p.textContent = 'x';

                // set the color to the text
                if (t === 'o') {
                    p.style.color = '#FF5656'
                } else {
                    p.style.color = '#6A7EFC'
                }

                square[i].appendChild(p)

                if (win()) {
                    sound(clickSound)
                    action()
                    return;
                };

                square[i].innerHTML = ''
            }
        }

        // prevent user from wining
        for (let i = 0; i < square.length; i++) {
            if (square[i].textContent === '') {
                // create HTML paragraph
                const p = document.createElement('p');
                p.textContent = 'o';

                // set the color to the text
                if (t === 'o') {
                    p.style.color = '#FF5656'
                } else {
                    p.style.color = '#6A7EFC'
                }

                square[i].appendChild(p)

                if (win()) {
                    p.textContent = 'x';
                    t = 'o' ;
                    square[i].appendChild(p)

                    sound(clickSound)
                    action()

                    return;
                }

                square[i].innerHTML = ''
            }
        }

        // else play in random place
        easyMode()
    }, 500);
}

function hardMode() {
    setTimeout(() => {
        if (turn !== 'bot' || t !== 'x' || gameOver) return;

        let bestScore = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < square.length; i++) {

            if (square[i].textContent === '') {

                // put X in random place
                square[i].textContent = 'x';

                // try to find way to wim
                let score = minimax('o', 0);

                // if can't win reset the square
                square[i].textContent = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        // find the best way to win
        function minimax(player, depth) {
            let winner = win();
            let bestScore = player === 'x' ? -Infinity : Infinity;

            if (winner === 'x') return 10 - depth;
            if (winner === 'o') return depth - 10;
            if (checkDraw()) return 0;

            for (let i = 0; i < square.length; i++) {
                if (square[i].textContent === '') {

                    square[i].textContent = player

                    let nextPlayer = player === 'x' ? 'o': 'x'

                    let score = minimax(nextPlayer , depth + 1)

                    square[i].textContent = ''

                    if(player === 'x') {
                        bestScore = Math.max(bestScore, score)
                    } else {
                        bestScore = Math.min(bestScore, score)
                    }
                }
            }
            return bestScore;
        }

        if (bestMove !== -1) {

            const p = document.createElement('p');
            p.textContent = 'x';
            p.style.color = '#6A7EFC';

            square[bestMove].appendChild(p);

            sound(clickSound);

            t = 'o';
            turn = 'user';

            msg.textContent = 'o turn';

            action();
        }

    }, 500);
}

function singlePlayer() {
    if(turn === 'user' && t === 'o'){
        square.forEach(box => {
            box.addEventListener('click', () => {
                
                if (gameOver || t === 'x') return;

                sound(clickSound)

                if (box.textContent === '') {
                    // create HTML paragraph
                    const p = document.createElement('p');
                    p.textContent = t;

                    // set the color to the text
                    if (t === 'o') {
                        p.style.color = '#FF5656'
                    } else {
                        p.style.color = '#6A7EFC'
                    }
                    // change t value
                    t = t === 'o' ? 'x' : 'o'
                                
                    msg.textContent = t + ' turn'

                    box.appendChild(p)

                    turn = 'bot'   
                    if (playMode === 'easy'){
                        let winner = win();
                        if(!winner) easyMode()
                    }
                    else if (playMode === 'medium'){
                        let winner = win();
                        if(!winner) {
                            mediumMode()
                        }
                    }
                    else if (playMode === 'hard'){
                        let winner = win();
                        if(!winner) {
                            hardMode()
                        }
                    }

                    action()
                }
            });
        });
    } 
    else {
        if (playMode === 'easy') easyMode()
        else if (playMode === 'medium') mediumMode()
        else if (playMode === 'hard') hardMode()
    }
};

// how to play
tPlayer.addEventListener('click', () => {
    start.classList.add('hide');
    pointCon.classList.add('show');
    
    playMode = '2player';

    msg.textContent = t + ' turn';

    twoPlayer()
});

sPlayer.addEventListener('click', () => {
    levelD.classList.add('show');
    start.classList.add('hide');
});

backL.addEventListener('click', () => {
    levelD.classList.remove('show');
    start.classList.remove('hide');
});

// onclick action
function singleGameSetting() {
    levelD.classList.remove('show');
    pointCon.classList.add('show');

    msg.textContent = t + ' turn';

    singlePlayer()
};

mode1.addEventListener('click', () => {
    singleGameSetting()
    playMode = 'easy';
});
mode2.addEventListener('click', () => {
    singleGameSetting()
    playMode = 'medium';
});
mode3.addEventListener('click', () => {
    singleGameSetting()
    playMode = 'hard';
});

// play again
playAgain.addEventListener('click', () => {
    // remove the last game
    square.forEach(box => {
        box.innerHTML = '';
    });

    // new game
    msg.textContent = t + ' turn';
    gameOver = false;
    pointCon.classList.add('show');
    again.classList.remove('show');
    // two run the function as the state
    if (playMode === '2player') {
        twoPlayer()
    } else {
        singlePlayer()
    }
});