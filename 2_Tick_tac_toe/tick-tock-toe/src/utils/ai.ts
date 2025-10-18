import { checkWinner, getAvailableMoves, getOpponent, isGameOver, makeMove, type Board, type Player } from "./gameLogic";

export type Difficulty = 'easy' | 'hard';

export interface AIMove {
    position: number;
    positionsEvaluated: number;
    thinkingTime: number;
    score?: number;
}

export function getAIMove(board: Board, player: Player, difficulty: Difficulty): AIMove {
    const startTime = performance.now();

    let result: AIMove;
    if (difficulty === 'easy') {
        result = getEasyMove(board, player);
    }
    else {
        result = getHardMove(board, player);
    }

    result.thinkingTime = performance.now() - startTime;
    return result;
}

function getEasyMove(board: Board, player: Player): AIMove {
    const availableMoves = getAvailableMoves(board);

    // 70% random move
    // 30% make a smarter move
    const shouldPlaySmart = Math.random() > 0.7;

    if (shouldPlaySmart) {
        for (const move of availableMoves) {
            const testBoard = makeMove(board, move, player);
            if (checkWinner(testBoard)) {
                return {
                    position: move,
                    positionsEvaluated: availableMoves.length,
                    thinkingTime: 0
                }
            }
        }

        if (Math.random() > 0.5) {
            const opponent = getOpponent(player);
            for (const move of availableMoves) {
                const testBoard = makeMove(board, move, opponent);
                if (checkWinner(testBoard)) {
                    return {
                        position: move,
                        positionsEvaluated: availableMoves.length,
                        thinkingTime: 0
                    }
                }
            }
        }
    }

    //random move
    const randomIndex = Math.floor(Math.random() * availableMoves.length);

    return {
        position: availableMoves[randomIndex],
        positionsEvaluated: availableMoves.length,
        thinkingTime: 0,
    }

}

function getHardMove(board: Board, player: Player): AIMove {
    let positionsEvaluated = 0;
    let bestScore = -Infinity;
    let bestMove = -1;

    const availableMoves = getAvailableMoves(board);

    console.log('\n=== AI Move Evaluation (Hard Mode) ===');
    console.log('Current Board:', board);
    console.log('Available Moves:', availableMoves);

    for (const move of availableMoves) {
        const testBoard = makeMove(board, move, player);

        const { score, positions } = minimax(testBoard, 0, false, player, -Infinity, Infinity);
        positionsEvaluated += positions;

        //console.log(`Move ${move}: Score = ${score} (evaluated ${positions} positions)`);

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }

    }

    return {
        position: bestMove,
        positionsEvaluated,
        thinkingTime: 0,
        score: bestScore,
    };
}


/**
 * Minimax algorithm with alpha-beta pruning
 * @param board - Current board state
 * @param depth - Current depth in the game tree
 * @param isMaximizing - Whether this is a maximizing or minimizing player
 * @param aiPlayer - The AI player (X or O)
 * @param alpha - Alpha value for pruning
 * @param beta - Beta value for pruning
 * @returns Score and number of positions evaluated
 */
function minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    aiPlayer: Player,
    alpha: number,
    beta: number
): { score: number; positions: number } {
    let positionsEvaluated = 1;

    // Check terminal states
    const winner = checkWinner(board);
    if (winner) {
        if (winner.winner === aiPlayer) {
            return { score: 10 - depth, positions: positionsEvaluated }; // Win (prefer faster wins)
        } else {
            return { score: depth - 10, positions: positionsEvaluated }; // Loss (prefer slower losses)
        }
    }

    if (isGameOver(board)) {
        return { score: 0, positions: positionsEvaluated }; // Draw
    }

    const availableMoves = getAvailableMoves(board);

    if (isMaximizing) {
        let maxScore = -Infinity;

        for (const move of availableMoves) {
            const testBoard = makeMove(board, move, aiPlayer);
            const { score, positions } = minimax(testBoard, depth + 1, false, aiPlayer, alpha, beta);
            positionsEvaluated += positions;
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);

            if (beta <= alpha) {
                break; // Beta cutoff
            }
        }

        return { score: maxScore, positions: positionsEvaluated };
    } else {
        let minScore = Infinity;
        const opponent = getOpponent(aiPlayer);

        for (const move of availableMoves) {
            const testBoard = makeMove(board, move, opponent);
            const { score, positions } = minimax(testBoard, depth + 1, true, aiPlayer, alpha, beta);
            positionsEvaluated += positions;
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);

            if (beta <= alpha) {
                break; // Alpha cutoff
            }
        }

        return { score: minScore, positions: positionsEvaluated };
    }
}
