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
    if (score.black > score.white) {
      dispatch(incrementPoint(20));
      return '黒の勝ち！';
    } else if (score.black < score.white) {
      dispatch(decrementPoint(10));
      return '白の勝ち！';
    }
    dispatch(incrementPoint(5));
    return '引き分け！';
  }, [dispatch]);

  const makeMove = useCallback((row: number, col: number) => {
    if (gameOver || !isValidMove(board, row, col, currentPlayer)) return;
  
    const newBoard = [...board.map(row => [...row])];
    newBoard[row][col] = currentPlayer;
  
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
  
    if (!flipped) return;
  
    setBoard(newBoard);
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
  
    if (hasValidMoves(newBoard, nextPlayer)) {
      setCurrentPlayer(nextPlayer);
    } else {
      if (!hasValidMoves(newBoard, currentPlayer)) {
        setGameOver(true);
        const score = getScore();
        handleGameEnd(score);
      } else {
        setPassMessage(`${nextPlayer === 1 ? '黒' : '白'}の置ける場所がありません`);
        setTimeout(() => setPassMessage(''), 2000);
      }
    }
  }, [board, currentPlayer, gameOver, getScore, handleGameEnd]);

  // AIの手番を処理
  useEffect(() => {
    if (currentPlayer !== 2 || gameOver) return;
  
    const timeoutId = setTimeout(() => {
      let emptyCount = 0;
      board.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) emptyCount++;
        });
      });
  
      if (emptyCount === 0) {
        const score = getScore();
        handleGameEnd(score);
        setGameOver(true);
        return;
      }
  
      const move = getAIMove(board, 2);
      if (!move) {
        if (!hasValidMoves(board, 1)) {
          const score = getScore();
          handleGameEnd(score);
          setGameOver(true);
        } else if (hasValidMoves(board, 1)) {
          setPassMessage('コンピュータはパスします');
          setTimeout(() => setPassMessage(''), 2000);
          setCurrentPlayer(1);
        }
        return;
      }
  
      makeMove(move[0], move[1]);
    }, 500);
  
    return () => clearTimeout(timeoutId);
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
              {currentPlayer === 1 ? 'あなたの番' : 'コンピュータの番'}
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
                  <div className="text-lg mt-2">{handleGameEnd(score)}</div>
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

          <div className="flex justify-center">
            <div className="inline-block bg-green-700 p-2 md:p-4 rounded-lg shadow-xl">
              {board.map((row, i) => (
                <div key={i} className="flex">
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      onClick={() => currentPlayer === 1 && makeMove(i, j)}
                      className={`w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 border border-green-900 
                        flex items-center justify-center cursor-pointer
                        ${currentPlayer === 1 && isValidMove(board, i, j, 1) ? 'hover:bg-green-600' : ''}`}
                    >
                      {cell !== 0 && (
                        <div className={`w-6 h-6 md:w-10 md:h-10 lg:w-14 lg:h-14 rounded-full 
                          transform transition-all duration-300
                          ${cell === 1 ? 'bg-black' : 'bg-white'} shadow-lg
                          ${currentPlayer === 1 ? 'hover:scale-105' : ''}`}
                        />
                      )}
                      {currentPlayer === 1 && cell === 0 && isValidMove(board, i, j, 1) && (
                        <div className="w-3 h-3 rounded-full bg-green-500 opacity-50" />
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