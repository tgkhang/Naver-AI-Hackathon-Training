export type Player = 'X' | 'O' | null;

export function getOpponent(player: Player): Player {
  if (player === 'X') return 'O';
  if (player === 'O') return 'X';
  return null;
}

export type Board = Player[];

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export function createEmptyBoard(): Board {
    return Array(9).fill(null);
}


export interface WinningLine {
    indices: number[];
    winner: Player;
}

export function checkWinner(board: Board): WinningLine | null {

    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { indices: combination, winner: board[a] };
        }
    }
    return null;
}

export function isDraw(board: Board): boolean {
    return board.every(cell => cell !== null) && !checkWinner(board);
}

export function isGameOver(board: Board): boolean {
    return checkWinner(board) !== null || isDraw(board);
}

//
export function getAvailableMoves(board: Board): number[] {
    return board.reduce<number[]>((moves, cell, index) => {
        if (cell === null) {
            moves.push(index);
        }
        return moves;
    }, []);
}

export function makeMove(board: Board, position: number, player: Player): Board {
  if (board[position] !== null) {
    throw new Error('Cell is already occupied');
  }
  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
}