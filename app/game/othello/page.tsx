'use client';
import { useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAIMove, isValidMove } from './ai';
import { incrementPoint, decrementPoint } from "@/redux/slices/jankenSlice";
import { Cell } from './types';

export default function OthelloPage() {
  const dispatch = useDispatch();
  const purchasedGames = useSelector((state: RootState) => state.games.purchasedGames);
  const point = useSelector((state: RootState) => state.janken.point);
  
  const [board, setBoard] = useState<Cell[][]>(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(2);
  const [gameOver, setGameOver] = useState(false);
  const [passMessage, setPassMessage] = useState('');
  const [gameResult, setGameResult] = useState<string | null>(null)

  // 初期盤面を作成
  function initializeBoard(): Cell[][] {
    const board = Array(8).fill(0).map(() => Array(8).fill(0));
    board[3][3] = 2;
    board[3][4] = 1;
    board[4][3] = 1;
    board[4][4] = 2;
    return board;
  }

  // 指定したプレイヤーが置ける場所があるかチェック
  function hasValidMoves(board: Cell[][], player: 1 | 2): boolean {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (isValidMove(board, i, j, player)) return true;
      }
    }
    return false;
  }

const getScore = useCallback(() => {
  let black = 0, white = 0;
  board.forEach(row => {
    row.forEach(cell => {
      if (cell === 1) black++;
      if (cell === 2) white++;
    });
  });
  return { black, white };
}, [board]);

  // ゲーム終了時の処理
  const handleGameEnd = useCallback((score: { black: number; white: number }) => {
    console.log("handleGameEnd called with score:", score);
  
    if (gameOver) {
      console.log("Game already over, skipping point update.");
      return;
    }
  
    setGameOver(true); // **ゲームオーバーを確実に true にする**
  
    let resultMessage = "";
    if (score.black > score.white) {
      dispatch(incrementPoint(30)); // **勝利時: +30ポイント**
      resultMessage = "黒の勝ち！ +30P";
    } else if (score.black < score.white) {
      dispatch(decrementPoint(15)); // **敗北時: -15ポイント**
      resultMessage = "白の勝ち！ -15P";
    } else {
      dispatch(incrementPoint(10)); // **引き分け時: +10ポイント**
      resultMessage = "引き分け！ +10P";
    }
  
    setGameResult(resultMessage); // **勝敗結果を state に保存**
    console.log("Game result:", resultMessage);
  }, [dispatch, gameOver]);
  

const makeMove = useCallback((row: number, col: number) => {
  console.log(`makeMove called with row: ${row}, col: ${col}`);

  if (gameOver) {
    console.log("Game is already over, stopping move.");
    return;
  }

  if (!isValidMove(board, row, col, currentPlayer)) {
    console.log("Invalid move detected, returning.");
    return;
  }

  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = currentPlayer;
  console.log("New move placed on board.");

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  let flipped = false;
  directions.forEach(([dx, dy]) => {
    let x = row + dx;
    let y = col + dy;
    const toFlip: [number, number][] = [];

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (newBoard[x][y] === 0) break;
      if (newBoard[x][y] === currentPlayer) {
        if (toFlip.length > 0) {
          toFlip.forEach(([fx, fy]) => {
            newBoard[fx][fy] = currentPlayer;
          });
          flipped = true;
        }
        break;
      }
      toFlip.push([x, y]);
      x += dx;
      y += dy;
    }
  });

  if (!flipped) {
    console.log("No pieces flipped, move is not valid.");
    return;
  }

  setBoard(newBoard);

  // **ゲーム終了判定の修正**
  if (!hasValidMoves(newBoard, 1) && !hasValidMoves(newBoard, 2)) {
    console.log("No valid moves left for both players, ending game.");
    setTimeout(() => {
      if (!gameOver) {  // **すでにゲーム終了していたら処理しない**
        const score = getScore();
        console.log("Final score:", score);
        handleGameEnd(score); // **修正：必ず実行**
      }
    }, 100);
    return;
  }

  const nextPlayer = currentPlayer === 1 ? 2 : 1;
  if (hasValidMoves(newBoard, nextPlayer)) {
    setTimeout(() => setCurrentPlayer(nextPlayer), 100);
  } else {
    console.log(`Next player ${nextPlayer} has no valid moves.`);
    setPassMessage(`${nextPlayer === 1 ? '黒' : '白'}の置ける場所がありません`);
    setTimeout(() => setPassMessage(''), 2000);
  }
}, [board, currentPlayer, gameOver, getScore, handleGameEnd]);

  // AIの手番を処理
  useEffect(() => {
    console.log("useEffect triggered with currentPlayer:", currentPlayer, "gameOver:", gameOver);
  
    // **ゲームオーバーなら何もせずに return**
    if (gameOver) {
      console.log("Game over detected in useEffect, stopping execution immediately.");
      return;
    }
  
    if (currentPlayer !== 2) {
      console.log("Not AI's turn, skipping AI logic.");
      return;
    }
  
    const timeoutId = setTimeout(() => {
      console.log("AI is thinking...");
  
      const emptyCells = board.flat().filter(cell => cell === 0).length;
      console.log("Empty cells count:", emptyCells);
  
      if (emptyCells === 0 || (!hasValidMoves(board, 1) && !hasValidMoves(board, 2))) {
        console.log("No moves left, game over.");
        const score = getScore();
        console.log("Final score:", score);
        setGameOver(true);
        return;
      }
  
      const move = getAIMove(board, 2);
      if (!move) {
        console.log("AI has no valid moves.");
        if (!hasValidMoves(board, 1)) {
          console.log("Neither player can move, ending game.");
          const score = getScore();
          setGameOver(true);
          handleGameEnd(score);
        } else {
          console.log("AI must pass, switching turn to player.");
          setPassMessage('コンピュータはパスします');
          setTimeout(() => setPassMessage(''), 2000);
          setTimeout(() => setCurrentPlayer(1), 100);
        }
        return;
      }
  
      console.log("AI moves to:", move);
      setTimeout(() => makeMove(move[0], move[1]), 100);
    }, 500);
  
    return () => {
      console.log("Clearing AI move timeout.");
      clearTimeout(timeoutId);
    };
  }, [currentPlayer, board, gameOver, getScore, handleGameEnd, makeMove]);
  

  // リセットボタンの処理も修正
  function resetGame() {
    setBoard(initializeBoard());
    setCurrentPlayer(2); // コンピュータから開始
    setGameOver(false);
  }

  if (!purchasedGames.includes('othello')) {
    return (
      <div className="min-h-screen-vh container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">オセロ</h1>
        <p className="mb-4">このゲームをプレイするには購入が必要です。</p>
        <div className="space-x-4">
          <Link href="/shop" className="text-blue-500 hover:text-blue-700">
            ショップへ戻る
          </Link>
          <Link href="/game" className="text-blue-500 hover:text-blue-700">
            ゲーム選択に戻る
          </Link>
        </div>
      </div>
    );
  }

const score = getScore();

return (
  <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 p-4">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">オセロ</h1>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="text-lg font-semibold text-white">ポイント: {point}P</span>
          <span className="text-lg text-white text-center">
            {gameOver ? "ゲーム終了" : (currentPlayer === 1 ? 'あなたの番' : 'コンピュータの番')}
          </span>
          <Link 
            href="/game" 
            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30"
          >
            ゲーム選択に戻る
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <div className="text-2xl font-bold text-white mb-4">スコア</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-white">
                <span>黒（あなた）:</span>
                <span className="text-2xl font-bold">{score.black}</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span>白（コンピュータ）:</span>
                <span className="text-2xl font-bold">{score.white}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg text-white">
            {!gameOver ? (
              <div className="text-lg">
                {passMessage ? (
                  <div className="text-blue-300 font-semibold animate-fade-in">
                    {passMessage}
                  </div>
                ) : (
                  hasValidMoves(board, currentPlayer) ? (
                    `現在のプレイヤー: ${currentPlayer === 1 ? '黒（あなた）' : '白（コンピュータ）'}`
                  ) : (
                    `${currentPlayer === 1 ? '黒（あなた）' : '白（コンピュータ）'}の置ける場所がありません`
                  )
                )}
              </div>
            ) : (
              <div>
                <div className="text-xl font-bold">ゲーム終了！</div>
                <div className="text-lg mt-2">{gameResult}</div> {/* ここで勝敗結果を表示 */}
              </div>
            )}
          </div>

          <button
            onClick={resetGame}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg"
          >
            新しいゲームを開始
          </button>
        </div>

        <div className="w-full lg:w-2/3 flex justify-center">
          <div className="w-full max-w-[500px] aspect-square bg-green-700 p-1 md:p-2 rounded-lg shadow-xl">
            {board.map((row, i) => (
              <div key={i} className="flex h-[12.5%]">
                {row.map((cell, j) => (
                  <div
                    key={j}
                    onClick={() => currentPlayer === 1 && makeMove(i, j)}
                    className={`
                      w-[12.5%] h-full border border-green-900 
                      flex items-center justify-center cursor-pointer
                      ${currentPlayer === 1 && isValidMove(board, i, j, 1) ? 'hover:bg-green-600' : ''}
                    `}
                  >
                    {cell !== 0 && (
                      <div 
                        className={`
                          w-[80%] h-[80%] rounded-full 
                          transform transition-all duration-300
                          ${cell === 1 ? 'bg-black' : 'bg-white'} shadow-lg
                          ${currentPlayer === 1 ? 'hover:scale-105' : ''}
                        `}
                      />
                    )}
                    {currentPlayer === 1 && cell === 0 && isValidMove(board, i, j, 1) && (
                      <div className="w-[30%] h-[30%] rounded-full bg-green-500 opacity-50" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}