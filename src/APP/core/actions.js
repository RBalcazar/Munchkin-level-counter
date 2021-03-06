import { clearState, loadState } from './localstorage';
import store from '../store';

const PLAYER = {
    id: '',
    name: '',
    avatar: '',
    tablePosition: 0,
    characterLevel: 0,
    gearLevel: 0,
    combatLevel: 0
}

export function updateView(view) {
    return {
        type: 'UPDATE_VIEW',
        payload: view
    }
}

export function createGame() {
    return {
        type: 'CREATE_GAME'
    }
}

export function loadGame() {
    return (dispatch, getState) => {
        const state = loadState();

        dispatch({
            type: 'LOAD_GAME',
            payload: state
        });
    }
}

export function updateGame() {

    return (dispatch, getState) => {
        const WINNER = checkForWinner();

        if(!WINNER) {
            dispatch({type: 'UPDATE_GAME'});
        } else {
            dispatch({
                type: 'UPDATE_VIEW',
                payload: 'winner'
            });
        }
    }
}

export function updatePlayerOrder(playerID, newIndex) {
    return(dispatch) => {

        dispatch({
            type: 'UPDATE_PLAYER_ORDER',
            payload: {
                playerID: playerID,
                newIndex: newIndex
            }
        })
    }
}

export function deleteGame() {
    clearState();
    return {
        type: 'DELETE_GAME'
    }
}

export function endGame(gameData) {
    return {
        type: 'END_GAME',
        payload: gameData
    }
}

export function unsetPlayerEdit() {
    return {
        type: 'UNSET_PLAYER_EDIT'
    }
}

export function addPlayer(playerName) {

    return (dispatch, getState) => {
        const ID = getState().app.gameSession.playerList.length + 1;
        const NAME = checkNameForSpaces(playerName);
        const FINAL_NAME = NAME || `player ${ID}`;

        if(getState().app.editPlayer !== null) {
            dispatch({
                type: 'UNSET_PLAYER_EDIT'
            })
        }

        const PLAYERCOPY = {...PLAYER,
            id: `player${ID}`,
            name: FINAL_NAME,
            avatar: getState().app.selectedAvatar
        }

        if (checkPlayerLimit()) {
            console.log('too many players');

            dispatch({
                type: 'MSG'
            });
        } else {


            dispatch({
                type: 'ADD_PLAYER',
                payload: PLAYERCOPY
            });
        }
    }
}

export function updatePlayer(playerID, playerName) {
    return(dispatch, getState) => {
        const NAME = checkNameForSpaces(playerName);

        dispatch({
            type: 'UPDATE_PLAYER',
            payload: {
                id: playerID,
                name: NAME || null,
                avatar: getState().app.selectedAvatar
            }
        });
    }
}

export function resetDefeatedPlayer(playerID) {
    return(dispatch, getState) => {

        dispatch({
            type: 'RESET_DEFEATED_PLAYER',
            payload: playerID
        })
    }
}

export function decreasePlayerLevel(playerID, levelType) {
    return {
        type: 'DECREASE_PLAYER_LEVEL',
        payload: {
            id: playerID,
            levelType: levelType
        }
    }
}

export function increasePlayerLevel(playerID, levelType) {
    return {
        type: 'INCREASE_PLAYER_LEVEL',
        payload: {
            id: playerID,
            levelType: levelType
        }
    }
}

export function deletePlayer(playerID, deletePhase) {
    return(dispatch, getState) => {

        if(getState().app.editPlayer !== null) {
            dispatch({
                type: 'UNSET_PLAYER_EDIT'
            })
        }

        dispatch({
            type: 'DELETE_PLAYER',
            payload: {
                playerID: playerID,
                deletePhase: deletePhase
            }
        })
    }
}

export function setPlayerEdit(playerID) {
    return {
        type: 'SET_PLAYER_EDIT',
        payload: playerID
    }
}

export function nextAvatarListId() {
    return {
        type: 'NEXT_AVATAR_ID'
    }
}

export function previousAvatarListId() {
    return {
        type: 'PREVIOUS_AVATAR_ID'
    }
}

export function toggleAlterEgo() {
    return {
        type: 'TOGGLE_ALTEREGO'
    }
}

export function toggleEditMode() {
    return {
        type: 'TOGGLE_EDIT_MODE'
    }
}


/*============================================================================*/
/*                             Helper functions                               */
/*============================================================================*/

function checkNameForSpaces(name) {
    if (!name.replace(/\s/g, '').length) {
        name = null;
    }
    return name;
}


function checkForWinner() {
    const STATE = store.getState();
    return STATE.app.gameSession.playerList.find((player) => {
        return player.characterLevel === 10;
    });
}

function checkPlayerLimit() {
    const STATE = store.getState();

    if (STATE.app.gameSession.playerList.length === 6) {
        return true;
    }

    return false;
}
