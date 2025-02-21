import { Cell } from './types';

// AIの手を決定する関数
export function getAIMove(board: Cell[][], player: 1 | 2): [number, number] | null {
  const validMoves: [number, number][] = [];
  
  // 有効な手を収集
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (isValidMove(board, i, j, player)) {
        validMoves.push([i, j]);
      }
    }
  }
  
  // 有効な手がない場合はnullを返す
  if (validMoves.length === 0) return null;
  
  // ランダムに選択
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

// 指定された位置が有効な手かどうかを判定
export function isValidMove(board: Cell[][], row: number, col: number, player: 1 | 2): boolean {
  if (board[row][col] !== 0) return false;

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  return directions.some(([dx, dy]) => {
    let x = row + dx;
    let y = col + dy;
    let foundOpponent = false;

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (board[x][y] === 0) return false;
      if (board[x][y] === player) return foundOpponent;
      foundOpponent = true;
      x += dx;
      y += dy;
    }
    return false;
  });
}

export function makeMove(board: number[][], row: number, col: number, player: 1 | 2): number[][] {
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = player;

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  directions.forEach(([dx, dy]) => {
    let x = row + dx;
    let y = col + dy;
    const toFlip: [number, number][] = [];

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (board[x][y] === 0) break;
      if (board[x][y] === player) {
        toFlip.forEach(([fx, fy]) => {
          newBoard[fx][fy] = player;
        });
        break;
      }
      toFlip.push([x, y]);
      x += dx;
      y += dy;
    }
  });

  return newBoard;
} 