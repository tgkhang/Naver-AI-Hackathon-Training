import { type Board as BoardType } from "../utils/gameLogic";
import Cell from "./Cell";

interface BoardProps {
  board: BoardType;
}

function Board({ board }: BoardProps) {
  return (
    <>
      <div>
        {board.map((cell, index) => (
          <Cell key={index} value={cell} />
        ))}
      </div>
    </>
  );
}

export default Board;
