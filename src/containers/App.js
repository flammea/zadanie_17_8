import React, {Component} from 'react';
import Board from '../components/Board';
import Navigation from '../components/Navigation';
import sudoku from 'sudoku-umd';
import styles from './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialBoard: localStorage.getItem('initialboard') ? localStorage.getItem('initialboard') : '',
            board: localStorage.getItem('board') ? localStorage.getItem('board') : '',
            error: '',
            newGameClicked: false,
            movesArray: localStorage.getItem('moves') ? JSON.parse(localStorage.getItem('moves')) : []
        }
    }

    startNewGame(level){
        const newGame = sudoku.generate(level);
        this.setState({
            board : newGame,
            initialBoard: newGame,
            error : '',
            newGameClicked: false
        });
        this.localStorageClearHandler();
    }

    newGameHandler() {
        this.setState({
            board : '',
            initialBoard: '',
            error: '',
            newGameClicked: true
        })
    }

    restartNewGame(){
        this.setState({
            board : this.state.initialBoard,
            error : ''
        });
    }

    solveSudoku(){
        if (sudoku.solve(this.state.board)) {
            this.setState({
                board : sudoku.solve(this.state.board),
                error : ''
            });
        } else {
            this.setState({error: "Sorry, but not all numbers are correct."});
        }
    }

    checkSudoku(){
        if (this.state.board !== this.state.initialBoard) {
            if (this.state.board === sudoku.solve(this.state.board)) {
                this.setState({error: "Great job! You win!"});
            } else if (sudoku.solve(this.state.board)) {
                this.setState({error: "So far so good!"});
            } else {
                this.setState({error: "Sorry, but not all numbers are correct."});
            }
        }   
    }

    onChangeHandler(value, id) {
        var array = this.state.board.split('').map((tile, index) => 
            (index === parseInt(id, 0)) ? ((value !== "") && (value < 10) && (value > 0) ? value : ".") : tile)
        .join('');
        this.setState({
            board : array,
            error : ""
        });
        this.setMovesArray(id, value, array);
    }

    setMovesArray(id, value, array) {
        var allMoves = this.state.movesArray.concat([{id, value}]);
        this.setState({movesArray : allMoves});
        this.localStorageHandler(array, allMoves);
    }

    localStorageHandler(currentGameState, allMoves) {
        localStorage.setItem('board', currentGameState);
        localStorage.setItem('initialboard', this.state.initialBoard);
        localStorage.setItem('moves', JSON.stringify(allMoves));
    }

    localStorageClearHandler() {
        localStorage.clear('initialboard');
        localStorage.clear('board');
        localStorage.clear('moves');
    }

    render() {
        return (
            <div className={styles.App}>
                <h1>Sudoku Game</h1>
                <Navigation
                    newGameHandler={() => this.newGameHandler()}
                    startNewGame={(level) => this.startNewGame(level)}
                    restartNewGame={() => this.restartNewGame()}
                    checkSudoku={() => this.checkSudoku()}
                    solveSudoku={() => this.solveSudoku()}
                    error={this.state.error}
                    newGameClicked={this.state.newGameClicked}
                />
                <Board 
                    board={this.state.board.split('')} 
                    initialBoard={this.state.initialBoard.split('')} 
                    onChange={(value, id) => this.onChangeHandler(value, id)}
                />
            </div>
        );
    }
}

export default App;