import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
        let getClasses = 'square';
        if (props.value){
            getClasses += ' ' + props.value;
        }
        if (props.winner){
            getClasses += ' winner';
        }

      return (
          <button className={getClasses} onClick={props.onClick}>
              {props.value}
          </button>
      );
  }
  
  class Board extends React.Component {

    isAWinnerPosition(i){
        return this.props.winnerPos.filter((value) => i === value).length > 0 ? true : false;
    }

    renderSquare(i) {
      return (
      <Square 
        value={this.props.squares[i]}
        winner = {this.isAWinnerPosition(i)} 
        onClick={() => this.props.onClick(i)}
      />
      );
    }
  
    render() {

      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                }
            ],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber +1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const endOfGame = calculateEOG(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move :
            'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}> {desc} </button>
                </li>
            );
        });

        let status;
        let winnerPositions = [null];
        if (winner) {
            winnerPositions = calculateWinnerPositions(current.squares);
            status = 'Winner: ' + winner;
        } else if (endOfGame) {
            status = 'End of game, tied.'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares = {current.squares}
                winnerPos = {winnerPositions}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateEOG (squares){
      let isEndOfGame;
      isEndOfGame = squares.filter(content => !content).length == 0;
    return isEndOfGame;
  }

  function calculateWinner(squares) {
      const lines = [
          [0,1,2],
          [3,4,5],
          [6,7,8],
          [0,3,6],
          [1,4,7],
          [2,5,8],
          [0,4,8],
          [2,4,6],
      ];
      for (let i=0; i <lines.length; i++){
          const [a,b,c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
              return squares[a];
          }
      }

      return null;
  }

  function calculateWinnerPositions(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i=0; i <lines.length; i++){
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }

    return null;
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  