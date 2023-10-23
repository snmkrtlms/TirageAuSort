/*
Le mode strict de JavaScript a été introduit dans ECMAScript 5 . 
Il applique une analyse plus stricte et une gestion des erreurs sur le code au moment de l'exécution. 
Il vous aide également à écrire du code plus propre et à détecter les erreurs et 
les bugs qui pourraient autrement passer inaperçus.
*/
'use strict'
const BODY = document.querySelector("body");
let divMainGame = null;
let btnPlay = null;
let btnRetry = null;
let btnStop = null;
let btnAddPerson = null;
let divCardsCtn = null;
let divBtnsForGames = null;

let playerList = [];
let time = 2;
let limitTime = 350;
let counterLoopAnimation = 0;
let playerChoosed = null;
let intervalChoosed;

/*
Je stock les noms des id et des class dans des variables global afin de pouvoir aller rechercher les noms dans tout mon code
et ce en évitant les erreurs potentiels.
Le nommage des constantes s'écrit en majuscule.
NB: La valeur des constantes (const) ne peuvent pas être modifiée.
*/
const CATCH_PLAYER_CLASS_NAME = "catch-player";
const BTN_CLASS_NAME = "btn";
const BTN_RED_CLASS_NAME = "btn-red";
const BTN_GREEN_CLASS_NAME = "btn-green";
const BTN_DARKSLATE_GRAY_CLASS_NAME = "btn-darkslategray";
const CARD_CLASS_NAME = "card";
const CONTENT_CLASS_NAME = "content";
const MODE_SELECTED_CLASS_NAME = "mode-selected";
const POSITION_UNDER_TOP_CLASS_NAME = "position-under-top";
const BTN_RESPONSE_QUESTION_CLASS_NAME = "btn-response-question";
const RIGHT_TO_LEFT_CLASS_NAME = "right-to-left";
const QUESTION_GAME_OVER_CLASS_NAME = "question-game-over";

const QUESTION_ID_NAME = "question";
const BEFORE_START_CONTAINER_ID_NAME = "before-start-container";
const START_BUTTON_ID_NAME = "start-button";
const TITLE_MODE_ID_NAME = "title-mode";
const CONTAINER_OF_CARDS_ID_NAME = "container-of-cards";
const MAIN_GAME_CTN_ID_NAME = "main-game-ctn";
const BTNS_FOR_GAMES_ID_NAME = "btns-for-games";
const ADD_PERSON_ID_NAME = "add-person";
const PLAY_ID_NAME = "play";
const RETRY_ID_NAME = "retry";
const STOP_ID_NAME = "stop";
const MESSAGE_WARNING_ID_NAME = "message-warning";
const WINNER_MESSAGE_ID_NAME = "message-winner";
const GAME_MODE_ID_NAME = "game-mode";
const BTN_ELECTION_ID_NAME = "btn-election";
const BTN_RANKING_ID_NAME = "btn-ranking";
const BTN_QUESTIONS_ID_NAME = "btn-questions";
const TRUE_RESPONSE_ID_NAME = "true-response";
const FALSE_RESPONSE_ID_NAME = "false-response";

const BACK_GROUND_COLOR_DISABLE = "rgb(88, 88, 88)";

const GAME_MODES = { election: "election", ranking: "classement", questions: "questions" }
let gameModeChoosed = GAME_MODES.election;
let h1TitleForMode = "Qui sera l'Elu?";
let playersPlayingArray = [];
const SIZE_TROPHY = "60";

let questions = []
const DIV_QUESTION = document.createElement("div");
DIV_QUESTION.id = QUESTION_ID_NAME;

creationBeforeStartContainer();

//Création de la zone principal
function creationBeforeStartContainer() {
    const divSC = document.createElement("div");
    divSC.id = BEFORE_START_CONTAINER_ID_NAME;
    const h1 = document.createElement("h1");
    h1.innerText = "Tirage au sort";
    const btnToEnterGame = document.createElement("button");
    btnToEnterGame.id = START_BUTTON_ID_NAME;
    btnToEnterGame.innerText = "Commencer";
    btnToEnterGame.classList.add(BTN_CLASS_NAME,BTN_RED_CLASS_NAME);
    BODY.appendChild(divSC)
    divSC.append(h1, btnToEnterGame);
    btnToEnterGame.onclick = () => {
        divSC.remove();
        creationGameZone();
        creationGameModes();
        changeGameMode(gameModeChoosed);
        checkToBegin(false);
    }
}

//Création de la zone de jeux
function creationGameZone() {
    divMainGame = document.createElement("div");
    divMainGame.id = MAIN_GAME_CTN_ID_NAME;
    BODY.appendChild(divMainGame);

    const divH1 = document.createElement("div");
    divH1.id = TITLE_MODE_ID_NAME;
    const h1Title = document.createElement("h1");
    h1Title.innerText = h1TitleForMode;
    divH1.appendChild(h1Title)

    divCardsCtn = document.createElement("div");
    divCardsCtn.id = CONTAINER_OF_CARDS_ID_NAME;
    divMainGame.appendChild(divCardsCtn);
    divCardsCtn.appendChild(divH1);

    divBtnsForGames = document.createElement("div");
    divBtnsForGames.id = BTNS_FOR_GAMES_ID_NAME;
    divMainGame.appendChild(divBtnsForGames);

    btnAddPerson = document.createElement("button");
    btnAddPerson.id = ADD_PERSON_ID_NAME;
    btnAddPerson.classList.add(BTN_CLASS_NAME, BTN_GREEN_CLASS_NAME);
    divBtnsForGames.appendChild(btnAddPerson);
    const iAddPerson = document.createElement("i");
    iAddPerson.classList.add("fa-solid", "fa-plus");
    btnAddPerson.appendChild(iAddPerson);
    btnAddPerson.onclick = () => {
        addPlayer();
    }

    btnPlay = document.createElement("button");
    btnPlay.id = PLAY_ID_NAME;
    btnPlay.classList.add(BTN_CLASS_NAME, BTN_GREEN_CLASS_NAME);
    divBtnsForGames.appendChild(btnPlay);
    const iPlay = document.createElement("i");
    iPlay.classList.add("fa-solid", "fa-play");
    btnPlay.appendChild(iPlay);
    btnPlay.onclick = () => {
        checkToBegin();
    }

    btnRetry = document.createElement("button");
    btnRetry.id = RETRY_ID_NAME;
    btnRetry.classList.add(BTN_CLASS_NAME, BTN_GREEN_CLASS_NAME);
    divBtnsForGames.appendChild(btnRetry);
    const iRetry = document.createElement("i");
    iRetry.classList.add("fa-solid", "fa-arrow-rotate-left");
    btnRetry.appendChild(iRetry);
    btnRetry.onclick = () => {
        retry();
    }

    btnStop = document.createElement("button");
    btnStop.id = STOP_ID_NAME;
    btnStop.classList.add(BTN_CLASS_NAME, BTN_GREEN_CLASS_NAME);
    divBtnsForGames.appendChild(btnStop);
    const iStop = document.createElement("i");
    iStop.classList.add("fa-solid", "fa-stop");
    btnStop.appendChild(iStop);
    btnStop.onclick = () => {
        stopGame();
    }
    disableRetryAndStop();
}

//Fonction qui permet le rajout d'une personne dans la liste de joueur ainsi que l'intégration du cote HTML
function addPlayer() {
    let name = nameOfPlayer();

    if (name != null) {
        playerList.push(name);

        const article = document.createElement("article");
        article.classList.add(CARD_CLASS_NAME);
        article.id = name;
        const divContent = document.createElement("div");
        divContent.classList.add(CONTENT_CLASS_NAME);
        const h4Name = document.createElement("h4");
        h4Name.innerText = name;
        const buttonRemove = document.createElement("button");
        buttonRemove.classList.add(BTN_CLASS_NAME, BTN_RED_CLASS_NAME);
        buttonRemove.innerText = "-";
        buttonRemove.onclick = () => {
            removePlayer(name);
        }

        divCardsCtn.appendChild(article);
        article.append(divContent);
        divContent.append(h4Name, buttonRemove);
    }
    checkToBegin(false);
}

// Fonction qui permet la vérification des différentes contraintes pour pouvoir rajouter le nom d'une personne
function nameOfPlayer() {
    let matchRegexName;
    let name;
    do {
        matchRegexName = false;
        name = prompt(`Nom du nouveau joueur.\nLes caractères spéciaux ne sont pas admis`);
        if (name) {
            name = name.trim();
            let playerExist = false;
            playerExist = checkIfPlayerExist(name);

            if (!playerExist) {
                matchRegexName = /^([a-z]{2,})([\- ][a-z]+)*([0-9]*)$/i.test(name);
            } else {
                alert("Joueur existant");
                name = prompt(`Essayez de le différencier. Veuillez introduire un nombre à la fin.\nExemple: ${name}1`);
                if (name != null) {
                    name = name.trim();
                    playerExist = checkIfPlayerExist(name);
                    matchRegexName = /^([a-z]{2,})([\- ][a-z]+)*([0-9]+)$/i.test(name);
                    
                    if (playerExist) {
                        alert("Joueur existant. Reboot de la demande...");
                        matchRegexName = false;
                    } else if (!matchRegexName) {
                        alert(`"${name}" n'est pas un nom valide. Reboot de la demande...`);
                    }
                } else {
                    return;
                }
            }
        } else {
            return;
        }
    } while (!matchRegexName);

    return name;
}

/*Fonction qui permet de vérifier si le nom inséré par l'utilisateur existe déjà dans notre liste. Nous utilisons dans ce cas
un foreach (autres manières également possible pour la vérification). */
function checkIfPlayerExist(name) {
    for (const person of playerList) {
        if (name.toLowerCase() == person.toLowerCase()) {
            return true;
        }
    }
    
    return false;
}

/* Fonction qui permet de vérifier si le nombre de joueur dans le jeu est égale ou supérieur au nombre 
de joueur requis pour pouvoir débuter */
function checkToBegin(wantToPlay = true) {
    const warningToDel = document.getElementById(MESSAGE_WARNING_ID_NAME);
    let minPlayer = 0;
    switch (gameModeChoosed) {
        case GAME_MODES.election:
            minPlayer = 2;
            break;
        case GAME_MODES.ranking:
            minPlayer = 4;
            break;
        case GAME_MODES.questions:
            minPlayer = 2;
            break;
        default:
            console.error(`Le mode de jeux ${gameModeChoosed} n'est pas reconnu`);
            break;
    }
    
    if (minPlayer > 0){
        if (playerList.length >= minPlayer) {
            if(warningToDel != undefined){
                warningToDel.remove();
            }
    
            btnPlay.disabled = false;
            btnPlay.classList.add(BTN_CLASS_NAME, BTN_RED_CLASS_NAME);
        } else {
            btnPlay.removeAttribute("class");
            btnPlay.disabled = true;
            let message = `Veuillez insérer au moins ${minPlayer} joueurs pour débuter la partie.`;
            
            if (warningToDel == undefined){
                const divWarning = document.createElement("div");
                divWarning.id = MESSAGE_WARNING_ID_NAME;
                const span = document.createElement("span");
                divWarning.appendChild(span);
                span.innerText = message;
                divMainGame.insertBefore(divWarning, divBtnsForGames);
            } else {
                const spanToModify = warningToDel.querySelector("span") 
                spanToModify.innerText = message;
            }
        }
        
        if (wantToPlay && !btnPlay.disabled) {
            beginTheGame();
        }
    }
}

//Fonction appeler lorsqu'on veut débuter le jeux
function beginTheGame() {
    switch (gameModeChoosed) {
        case GAME_MODES.ranking:
            initializePlayerPlayingArray();
            addHeightToRankingArticles();
            break;
        case GAME_MODES.questions:
            initializePlayerPlayingArray();
            initializeQuestionsArray();
            const titleMode = document.querySelector(`#${TITLE_MODE_ID_NAME} > h1`);
            if (titleMode){
                const divTitle = document.getElementById(TITLE_MODE_ID_NAME)
                titleMode.remove();
                divTitle.appendChild(DIV_QUESTION);
            }
            break;
        default:
            break;
    }

    const allBtn = document.querySelectorAll("button");
    btnAddPerson.style.display = "none";
    btnAddPerson.disabled = true;

    btnRetry.style.display = null;
    btnStop.style.display = null;

    for (const btn of allBtn) {
        btn.classList.remove(BTN_CLASS_NAME, BTN_RED_CLASS_NAME, BTN_GREEN_CLASS_NAME, BTN_DARKSLATE_GRAY_CLASS_NAME);
        btn.disabled = true;
    }

    choosingAPlayer();
}

/*Fonction qui permet de retourner la valeur de time incrémenté pour le mode election 
(Permet de choisir une personne de plus en plus lentement) */
function addTime() {
    return time = time * 1.10;
}

//Fonction qui permet de choisir une personne de manière random
function choosingAPlayer() {
    const playerAlreadySelected = document.getElementsByClassName(CATCH_PLAYER_CLASS_NAME);

    if (playerAlreadySelected[0] != undefined) {
        playerAlreadySelected[0].classList.remove(CATCH_PLAYER_CLASS_NAME);
    }

    let continueAnimation = true;
    let numberIndex;

    switch (gameModeChoosed) {
        case GAME_MODES.election:
            numberIndex = Math.floor(Math.random() * playerList.length);
            playerChoosed = playerList[numberIndex];
            break;
        case GAME_MODES.ranking:
            console.log(playersPlayingArray.length);
            if (playersPlayingArray.length > 1) {
                numberIndex = Math.floor(Math.random() * playersPlayingArray.length);
                playerChoosed = playersPlayingArray[numberIndex];
            } else {
                continueAnimation = false;
                playerChoosed = playersPlayingArray[0];
                playersPlayingArray.splice(0, 1);
                setTimeout(addPositionRankingOnCard, 500);
            }
            break;
        case GAME_MODES.questions:
            numberIndex = Math.floor(Math.random() * playersPlayingArray.length);
            playerChoosed = playersPlayingArray[numberIndex];
            continueAnimation = false;
            const articleSelected = document.getElementById(playerChoosed);
            articleSelected.classList.add(CATCH_PLAYER_CLASS_NAME);
            createQuestion();
            break;
        default:
            console.error(`Le mode de jeux ${gameModeChoosed} n'est pas reconnu`);
            continueAnimation = false;
            break;
    }
    if (continueAnimation) {
        const articleSelected = document.getElementById(playerChoosed);
        console.log(playerChoosed);
        console.log(articleSelected);
        articleSelected.classList.add(CATCH_PLAYER_CLASS_NAME);

        if (time > limitTime) {
            /*setInterval() permet d'exécuter une fonction ou un bloc de code en l'appelant en boucle 
            selon un intervalle de temps fixe entre chaque appel*/
            intervalChoosed = setInterval(animatePlayerChoosed, 500);
        } else {
            // setTimeout() permet de définir un minuteur qui exécute une fonction ou un code donné après la fin du délai indiqué
            setTimeout(choosingAPlayer, addTime());
        }
    }
}

//Fonction qui permet d'animer (clignotement) le joueur gagnant pour le mode election
function animatePlayerChoosed() {
    const playerSelected = document.getElementById(playerChoosed);
    const articlePlayer = document.querySelector(`.${CATCH_PLAYER_CLASS_NAME}`);

    if (counterLoopAnimation < 6) {
        if (articlePlayer) {
            playerSelected.classList.remove(CATCH_PLAYER_CLASS_NAME);
        } else {
            playerSelected.classList.add(CATCH_PLAYER_CLASS_NAME);
        }

        counterLoopAnimation++;
    } else {
        clearInterval(intervalChoosed);
        afterPlayerAnimated(playerChoosed);
    }
}

// Fonction qui permet d'effectuer des instruction après que le joueur séléctionné ai été animé
function afterPlayerAnimated(playerName) {
    switch (gameModeChoosed) {
        case GAME_MODES.election:
            disableRetryAndStop(false);
            createWinnerMessage(playerName);
            break;
        case GAME_MODES.ranking:
            /* Dans le cas où nous sommes dans le mode classement,
            nous allons chercher le nom dans notre tableau playersPlayingArray et nous le supprimons
            car la personne à été choisis et nous avons plus l'utilité de l'avoir dans le tableau
             */
            let index = playersPlayingArray.findIndex(p => p == playerName);
            playersPlayingArray.splice(index, 1);
            addPositionRankingOnCard();
            choosingAPlayer();
            break;
        default:
            console.error(`Le mode de jeux ${gameModeChoosed} n'est pas reconnu`);
            break;
    }
}

// Fonction qui permet de créer le message animé pour le mode election
function createWinnerMessage(playerName){
    const divMessage = document.createElement("div");
    divMessage.id = WINNER_MESSAGE_ID_NAME;
    const h1 = document.createElement("h1");
    h1.classList.add(RIGHT_TO_LEFT_CLASS_NAME);
    h1.innerText = `Félicitation ${playerName}, tu es l'élu!!`;
    divMessage.appendChild(h1);
    divMainGame.insertBefore(divMessage, divMainGame.children[0]);
}

//Fonction qui permet de retirer une personne du jeux (Utilisation d'une boucle 'for', mais d'autres moyens sont possible)
function removePlayer(playerName) {
    const article = document.getElementById(playerName);
    article.remove();
    const indexPlayer = playerList.indexOf(playerName);
    playerList.splice(indexPlayer, 1);
    checkToBegin(false);
}

//Fonction qui fera appel à d'autre fonction lorsque l'on clique sur le bouton retry
function retry() {
    resetGame();
    disableRetryAndStop();
    checkToBegin();
}

//Fonction qui permet de réinitialiser tout les valeurs
function resetGame(gameIsFinish = true) {
    const playerAlreadySelected = document.getElementsByClassName(CATCH_PLAYER_CLASS_NAME);
    const messageAnimated = document.getElementsByClassName(RIGHT_TO_LEFT_CLASS_NAME);

    /*getElementsByClassName permet d'aller récupérer toutes les classes.
    Nous vérifions donc à l'index 0 si nous avons un element, si oui, alors nous le retirons*/
    if (playerAlreadySelected[0] != undefined) {
        playerAlreadySelected[0].classList.remove(CATCH_PLAYER_CLASS_NAME);
    }

    if (messageAnimated[0] != undefined) {
        messageAnimated[0].remove();
    }

    counterLoopAnimation = 0;
    time = 2;
    playerChoosed = null;

    if (gameIsFinish) {
        switch (gameModeChoosed) {
            case GAME_MODES.election:
                break;
            case GAME_MODES.ranking:
                initializeCardStyle();
                break;
            case GAME_MODES.questions:
                initializeCardStyle();
                const titleMode = document.getElementById(TITLE_MODE_ID_NAME);
                const DIV_QST = document.getElementById(QUESTION_ID_NAME);
                while (DIV_QST.firstChild) {
                    DIV_QST.removeChild(DIV_QST.firstChild);
                  }
                  DIV_QST.classList.remove(QUESTION_GAME_OVER_CLASS_NAME);
                  DIV_QST.remove();
                const h1TitleForMode = document.createElement("h1");
                h1TitleForMode.innerText = "Qui sera le dernier en vie?";
                titleMode.appendChild(h1TitleForMode);
                break;
            default:
                console.error(`Le mode de jeux ${gameModeChoosed} n'est pas reconnu`);
                break;
        }
    }
}

//Fonction appelé lorsqu'on clique sur le bouton stop
function stopGame() {
    resetGame();
    btnAddPerson.style.display = null;
    btnAddPerson.classList.add(BTN_CLASS_NAME, BTN_GREEN_CLASS_NAME);
    btnAddPerson.removeAttribute("disabled");
    btnPlay.classList.add(BTN_CLASS_NAME, BTN_RED_CLASS_NAME);
    btnPlay.removeAttribute("disabled");

    disableRetryAndStop();

    //not() ==> permet de ne pas récuperer l'element mis entre paranthèse
    const allBtnCard = document.querySelectorAll(`button:not(#${ADD_PERSON_ID_NAME}):not(#${RETRY_ID_NAME}):not(#${BTN_ELECTION_ID_NAME}):not(#${BTN_RANKING_ID_NAME}):not(#${QUESTION_ID_NAME})`);
    for (const btnCard of allBtnCard) {
        btnCard.classList.add(BTN_CLASS_NAME, BTN_RED_CLASS_NAME);
        btnCard.removeAttribute("disabled");
    }

    const electionBtn = document.getElementById(BTN_ELECTION_ID_NAME);
    const rankingBtn = document.getElementById(BTN_RANKING_ID_NAME);
    const questionBtn = document.getElementById(BTN_QUESTIONS_ID_NAME);
    electionBtn.classList.add(BTN_CLASS_NAME, BTN_DARKSLATE_GRAY_CLASS_NAME);
    electionBtn.removeAttribute("disabled");
    rankingBtn.classList.add(BTN_CLASS_NAME, BTN_DARKSLATE_GRAY_CLASS_NAME);
    rankingBtn.removeAttribute("disabled");
    questionBtn.classList.add(BTN_CLASS_NAME, BTN_DARKSLATE_GRAY_CLASS_NAME);
    questionBtn.removeAttribute("disabled");

}

//Fonction qui permet d'activer ou désactiver les boutons retry et stop
function disableRetryAndStop(disable = true) {
    if (disable) {
        btnRetry.classList.remove(BTN_CLASS_NAME, BTN_GREEN_CLASS_NAME);
        btnRetry.style.disabled = true;
        btnRetry.style.display = "none";

        const btnStop = document.getElementById(STOP_ID_NAME);
        btnStop.classList.remove(BTN_CLASS_NAME, BTN_RED_CLASS_NAME);
        btnStop.style.disabled = true;
        btnStop.style.display = "none";
    } else {
        btnRetry.removeAttribute("disabled");
        btnRetry.classList.add(BTN_CLASS_NAME, BTN_GREEN_CLASS_NAME);

        btnStop.removeAttribute("disabled");
        btnStop.classList.add(BTN_CLASS_NAME, BTN_RED_CLASS_NAME);
    }
}

//Fonction qui permet la création des différents boutons mode de jeux
function creationGameModes() {
    const divGameMode = document.createElement("div");
    divGameMode.id = GAME_MODE_ID_NAME;
    const h2Modes = document.createElement("h2");
    h2Modes.innerText = "Modes de jeu";

    const btnElection = document.createElement("button");
    btnElection.innerText = "Election";
    btnElection.id = BTN_ELECTION_ID_NAME;
    btnElection.classList.add(BTN_CLASS_NAME, BTN_DARKSLATE_GRAY_CLASS_NAME);
    btnElection.onclick = () => { gameModeChoosed = GAME_MODES.election; changeGameMode() };

    const btnRanking = document.createElement("button");
    btnRanking.innerText = "Classement";
    btnRanking.id = BTN_RANKING_ID_NAME
    btnRanking.classList.add(BTN_CLASS_NAME, BTN_DARKSLATE_GRAY_CLASS_NAME);
    btnRanking.onclick = () => { gameModeChoosed = GAME_MODES.ranking; changeGameMode() };

    const btnQuestions = document.createElement("button");
    btnQuestions.innerText = "Questions";
    btnQuestions.id = BTN_QUESTIONS_ID_NAME
    btnQuestions.classList.add(BTN_CLASS_NAME, BTN_DARKSLATE_GRAY_CLASS_NAME);
    btnQuestions.onclick = () => { gameModeChoosed = GAME_MODES.questions; changeGameMode() };

    divGameMode.append(h2Modes, btnElection, btnRanking, btnQuestions);
    divMainGame.insertBefore(divGameMode, divMainGame.children[0]);
}

//Fonction qui permet de switcher de mode de jeux et ainsi mettre à jour les titres des jeux
function changeGameMode() {
    let titleMode = document.querySelector(`#${TITLE_MODE_ID_NAME} > h1`);
    let modeSelected = document.querySelector(`.${MODE_SELECTED_CLASS_NAME}`);

    /* on vérifie si un des bouttons de mode à la classe MODE_SELECTED_CLASS_NAME, si c'est le cas... 
    Alors nous le supprimons afin de rajouter la classe dans le bouton voulu (voir dans le switch juste en dessous)*/
    if (modeSelected) {
        modeSelected.classList.remove(MODE_SELECTED_CLASS_NAME);
    }

    //En fonction du mode cliqué, on met a jour le titre du mode de jeux et ainsi qu'activé le boutton. 
    switch (gameModeChoosed) {
        case GAME_MODES.election:
            const btnElection = document.getElementById(BTN_ELECTION_ID_NAME);
            btnElection.classList.add(MODE_SELECTED_CLASS_NAME);
            titleMode.innerText = "Qui sera l'Elu?";
            break;
        case GAME_MODES.ranking:
            const btnRanking = document.getElementById(BTN_RANKING_ID_NAME);
            btnRanking.classList.add(MODE_SELECTED_CLASS_NAME);
            titleMode.innerText = "Qui sera sur le podium?";
            break;
        case GAME_MODES.questions:
            const btnQuestions = document.getElementById(BTN_QUESTIONS_ID_NAME);
            btnQuestions.classList.add(MODE_SELECTED_CLASS_NAME);
            titleMode.innerText = "Qui sera le dernier en vie?";
            break;
        default:
            console.error(`Le mode de jeux ${gameModeChoosed} n'est pas reconnu`);
            break;
    }
    checkToBegin(false);
}

//Reinitialisation des cartes en suppriment les styles et en supprimant le premier enfant d'article
function initializeCardStyle(){
    const articles = document.querySelectorAll("article");
    articles.forEach(element => {
        element.removeAttribute("style");
        if (gameModeChoosed === GAME_MODES.ranking){
            element.removeChild(element.firstChild);
        }
    });
}

//Fonction qui permet d'initialiser le second tableaux de liste de joueurs
function initializePlayerPlayingArray(){
    playersPlayingArray = [];

    for (const person of playerList) {
        playersPlayingArray.push(person);
    }
}

//Fonction qui permet d'ajouter une taille dans l'article pour afficher les positions
function addHeightToRankingArticles(){
    const articles = document.querySelectorAll("article")
    articles.forEach(article => {
        const divPosition = document.createElement("div");
        divPosition.height = SIZE_TROPHY;
        divPosition.classList.add("position");
        article.insertBefore(divPosition, article.children[0]);
    });
}


//Fonction qui permet d'intégrer la position dans l'article du joueur pour le mode classement
function addPositionRankingOnCard() {
    const article = document.getElementById(playerChoosed);
    const trophGold = document.createElement("img");
    trophGold.height = SIZE_TROPHY;
    trophGold.style.paddingTop = "10px";
    const position = playersPlayingArray.length >= 1 ? playersPlayingArray.length + 1 : 1;
    const divPosition = article.querySelector(".position")
    //Une fois qu'une condition dans les case est correct, on rentre dans celui ci 
    switch (true) {
        case position > 3:
            const span = document.createElement("span");
            divPosition.classList.add(POSITION_UNDER_TOP_CLASS_NAME);
            divPosition.appendChild(span);
            article.style.backgroundColor = "#585858";
            span.innerText = `${position}ème`;
            break;
        case position === 3:
            trophGold.src = "./images/Trophy_bronze.png";

            divPosition.appendChild(trophGold);
            break;
        case position === 2:
            trophGold.src = "./images/Trophy_silver.png";

            divPosition.appendChild(trophGold);
            break;
        case position === 1:
            trophGold.src = "./images/Trophy_gold.png";

            divPosition.appendChild(trophGold);
            disableRetryAndStop(false);
            break;
        default:
            break;
    }
    
    //Permet d'insérer avant le premier enfant de mon article, la divPosition
    article.insertBefore(divPosition, article.children[0]);
    //Reset lorsque la position du joueur à été ajouté
    resetGame(false);
}

//Fnction qui permet de créer la question/afficher une question pour le mode question
function createQuestion(){
    const gameOverTitle = document.createElement("h1");
    const DIV_QST = document.getElementById(QUESTION_ID_NAME) ;

    if (questions.length > 0 && playersPlayingArray.length > 0){
        const divTitle = document.getElementById(TITLE_MODE_ID_NAME);
        const questionTitle = document.createElement("h1");
        questionTitle.style.margin = "0px";
        const responseTrue = document.createElement("button");
        responseTrue.id = TRUE_RESPONSE_ID_NAME;
        responseTrue.classList.add(CARD_CLASS_NAME, BTN_RESPONSE_QUESTION_CLASS_NAME);
        responseTrue.innerText = "Vrai";
        responseTrue.style.padding = "10px 0px";
    
        const responseFalse = document.createElement("button");
        responseFalse.classList.add(CARD_CLASS_NAME, BTN_RESPONSE_QUESTION_CLASS_NAME);
        responseFalse.style.padding = "10px 0px";
        responseFalse.innerText = "Faux";
        responseFalse.id = FALSE_RESPONSE_ID_NAME;

        divTitle.appendChild(DIV_QUESTION);
        DIV_QUESTION.append(questionTitle, responseTrue, responseFalse);
    
        const numberIndex = Math.floor(Math.random() * questions.length);
        questionTitle.innerText = questions[numberIndex].questionTitle;
    
        const player = document.getElementById(playerChoosed);
        const indexQuestion = questions.findIndex(p => p.questionTitle == questionTitle.innerText);
    
        responseTrue.onclick = () => {
            const indexPlayer = playersPlayingArray.findIndex(p => p === player.id);

            responseTrue.classList.remove(BTN_RESPONSE_QUESTION_CLASS_NAME);
            if (questions[numberIndex].value == 1){
                responseTrue.classList.add(BTN_CLASS_NAME, BTN_GREEN_CLASS_NAME);
            } else {
                responseTrue.classList.add(BTN_CLASS_NAME, BTN_RED_CLASS_NAME);
                player.style.backgroundColor = BACK_GROUND_COLOR_DISABLE;
                playersPlayingArray.splice(indexPlayer, 1);
            }
            responseFalse.onclick = null;
            questions.splice(indexQuestion, 1);
            player.classList.remove(CATCH_PLAYER_CLASS_NAME);
            ChooseOtherQuestionAndPlayer();
        }
    
        responseFalse.onclick = () => {
            const indexPlayer = playersPlayingArray.findIndex(p => p === player.id);

            responseFalse.classList.remove(BTN_RESPONSE_QUESTION_CLASS_NAME);
            if (questions[numberIndex].value == 0){
                responseFalse.classList.add(BTN_CLASS_NAME, BTN_GREEN_CLASS_NAME);
            } else {                
                responseFalse.classList.add(BTN_CLASS_NAME, BTN_RED_CLASS_NAME);
                player.style.backgroundColor = BACK_GROUND_COLOR_DISABLE;
                playersPlayingArray.splice(indexPlayer, 1);
            }
            responseTrue.onclick = null;
            questions.splice(indexQuestion, 1);
            player.classList.remove(CATCH_PLAYER_CLASS_NAME);
            ChooseOtherQuestionAndPlayer();
        }
        disableRetryAndStop(false);
    }
    else if (questions.length === 0 && playersPlayingArray.length === 0) {
        DIV_QST.classList.add(QUESTION_GAME_OVER_CLASS_NAME);
        gameOverTitle.innerText = "Tout le monde est éliminé et plus aucune question... Ca tombe bien!";
        DIV_QST.appendChild(gameOverTitle);
    }
    else if (playersPlayingArray.length === 0) {
        DIV_QST.classList.add(QUESTION_GAME_OVER_CLASS_NAME);
        gameOverTitle.innerText = "Tout le monde est éliminé? Sniff... =(";
        DIV_QST.appendChild(gameOverTitle);
    }
    else if (questions.length === 0) {
        DIV_QST.classList.add(QUESTION_GAME_OVER_CLASS_NAME);
        const numberWinner = playersPlayingArray.length;
        /* condition ternaire ==> Si numberWinner est strictement égale à 1 alors on affiche 'Tu est le seul survivant'
        aussi non '${numberWinner} survivants'*/
        gameOverTitle.innerText = `${numberWinner === 1 ? 'Tu est le seul survivant' : `${numberWinner} survivants`}? Félicitation ! Je n'ai plus d'autres questions`;
        DIV_QST.appendChild(gameOverTitle);
    }
}

//Fonction qui permet de choisir une personne et une question
function ChooseOtherQuestionAndPlayer() {
    setTimeout(() => {
        //Tant que DIV_QUESTION à un élèment, on supprime l'élèment en question
        while (DIV_QUESTION.firstChild) {
            DIV_QUESTION.removeChild(DIV_QUESTION.firstChild);
        }

        if (playersPlayingArray.length > 0){
        setTimeout(choosingAPlayer, 300);
        } else {
        createQuestion();
        }
    }, 1000);
}


/*Fonction qui permet d'initialiser la liste des questions et la réponse exacte à la question
0 = faux
1 = vrai
*/ 
function initializeQuestionsArray(){
    questions = [
        {
            questionTitle: "La durée d’un jour a toujours été de 24 heures?",
            value: 0,
        },
        {
            questionTitle: "Le palmier est un arbre?",
            value: 0,
        },
        {
            questionTitle: "Les légumes en conserves contiennent parfois plus de vitamines que les légumes frais?",
            value: 1,
        }
    ]
}
