'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { incrementPoint, decrementPoint } from "@/redux/slices/jankenSlice";
import { useState } from 'react';
import Link from 'next/link';
import { useGamePoints } from '@/hooks/useGamePoints';

type Card = {
  suit: string;
  value: number;
  display: string;
  isHidden: boolean;
};

// スタイル定数を追加
const CARD_COLORS = {
  '♥': 'text-red-600',
  '♦': 'text-red-600',
  '♠': 'text-gray-900',
  '♣': 'text-gray-900',
};

const CARD_STYLES = {
  base: `
    relative w-16 h-24 md:w-24 md:h-36 rounded-xl shadow-xl 
    transform transition-all duration-300 
    bg-gradient-to-br from-white to-gray-100
    border border-gray-200
  `,
  front: `
    flex flex-col items-center justify-center
    p-2 font-semibold
  `,
  back: `
    bg-gradient-to-br from-blue-600 to-blue-800
    flex items-center justify-center
    pattern-grid-white/10
  `,
  dealing: 'animate-deal',
  flipping: 'animate-flip',
  hover: 'hover:scale-105 hover:shadow-2xl',
};

export default function BlackjackPage() {
  const dispatch = useDispatch();
  const purchasedGames = useSelector((state: RootState) => state.games.purchasedGames);
  const point = useSelector((state: RootState) => state.janken.point);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'dealerTurn'>('playing');
  const [isDealing, setIsDealing] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string>('');
  const { savePointsAndReload } = useGamePoints();

  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck: Card[] = [];

    suits.forEach(suit => {
      values.forEach((value, index) => {
        newDeck.push({
          suit,
          value: index === 0 ? 11 : Math.min(10, index + 1),
          display: value,
          isHidden: true
        });
      });
    });

    return shuffle(newDeck);
  };

  const shuffle = (array: Card[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const calculateScore = (hand: Card[]) => {
    let score = hand.reduce((total, card) => total + card.value, 0);
    let aces = hand.filter(card => card.value === 11).length;
    
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  const dealCard = () => {
    if (deck.length === 0) return null;
    const newDeck = [...deck];
    const card = newDeck.pop();
    setDeck(newDeck);
    return card;
  };

  const dealCardWithAnimation = async () => {
    setIsDealing(true);
    const card = dealCard();
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsDealing(false);
    return card;
  };

  const startGame = async () => {
    // gameOverはすぐにfalseにして初期画面が表示されないようにする
    setGameOver(false);
    
    const newDeck = createDeck();
    setDeck(newDeck);
    
    // 一時的な配列を作成して、setPlayerHandとsetDealerHandを一度だけ呼び出す
    let tempPlayerCards: Card[] = [];
    let tempDealerCards: Card[] = [];
    
    // 初期カードを配る（アニメーション付き）
    setIsDealing(true);
    
    const player1 = newDeck.pop();
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealer1 = newDeck.pop();
    await new Promise(resolve => setTimeout(resolve, 300));
    const player2 = newDeck.pop();
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealer2 = newDeck.pop();
    
    if (player1 && player2 && dealer1 && dealer2) {
      tempPlayerCards = [player1, player2];
      tempDealerCards = [dealer1, dealer2];
    }

    // 状態を一括で更新
    setPlayerHand(tempPlayerCards);
    setDealerHand(tempDealerCards);
    setDeck(newDeck);
    setGameStatus('playing');
    setGameResult('');
    setIsDealing(false);
  };

  const hit = async () => {
    const card = await dealCardWithAnimation();
    if (card) {
      const newHand = [...playerHand, card];
      setPlayerHand(newHand);
      
      // プレイヤーがバーストした場合
      if (calculateScore(newHand) > 21) {
        setGameResult('バースト！あなたの負けです');
        dispatch(decrementPoint(10));
        setGameOver(true);
      }
    }
  };

  const stand = async () => {
    setIsFlipping(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsFlipping(false);
    setGameStatus('dealerTurn');

    // ディーラーの手札を公開
    setDealerHand(prevCards => prevCards.map(card => ({ ...card, isHidden: false })));

    // 少し待ってからディーラーの行動を開始
    setTimeout(() => {
      let currentDealerCards = [...dealerHand];
      let dealerScore = calculateScore(currentDealerCards);

      // ディーラーは17以上になるまでヒット
      while (dealerScore < 17) {
        const newCard = dealCard();
        if (newCard) {
          currentDealerCards = [...currentDealerCards, { ...newCard, isHidden: false }];
          dealerScore = calculateScore(currentDealerCards);
        }
      }

      setDealerHand(currentDealerCards);

      // さらに少し待ってから勝敗判定
      setTimeout(() => {
        const playerScore = calculateScore(playerHand);
        const dealerScore = calculateScore(currentDealerCards);
        
        let result = '';
        let pointChange = 0;

        if (dealerScore > 21) {
          result = 'ディーラーのバースト！あなたの勝ちです';
          pointChange = 20;
        } else if (playerScore > dealerScore) {
          result = 'あなたの勝ちです！';
          pointChange = 20;
        } else if (playerScore < dealerScore) {
          result = 'ディーラーの勝ちです';
          pointChange = -10;
        } else {
          result = '引き分けです';
          pointChange = 5;
        }

        setGameResult(result);
        if (pointChange > 0) {
          dispatch(incrementPoint(pointChange));
        } else if (pointChange < 0) {
          dispatch(decrementPoint(Math.abs(pointChange)));
        }
        
        setGameOver(true);
      }, 1000);
    }, 1000);
  };

  // ディーラーの見えるカードのスコアを計算
  const calculateVisibleScore = () => {
    if (dealerHand.length === 0) return 0;
    return dealerHand[0].value;
  };

  // カードコンポーネント
  const Card = ({ card, isHidden, isDealing, isFlipping }: {
    card: Card;
    isHidden: boolean;
    isDealing: boolean;
    isFlipping: boolean;
  }) => (
    <div className={`
      ${CARD_STYLES.base}
      ${isDealing ? CARD_STYLES.dealing : ''}
      ${isFlipping ? CARD_STYLES.flipping : ''}
      ${!isHidden ? CARD_STYLES.hover : ''}
    `}>
      {isHidden ? (
        <div className={`${CARD_STYLES.back} w-full h-full rounded-xl`}>
          <div className="text-white text-4xl">♠</div>
        </div>
      ) : (
        <div className={`${CARD_STYLES.front} ${CARD_COLORS[card.suit as keyof typeof CARD_COLORS]}`}>
          <div className="absolute top-2 left-2 text-xl">{card.display}</div>
          <div className="text-4xl">{card.suit}</div>
          <div className="absolute bottom-2 right-2 text-xl transform rotate-180">
            {card.display}
          </div>
        </div>
      )}
    </div>
  );

  const handleReturnToGameSelect = async () => {
    try {
      await savePointsAndReload(point);
    } catch (e) {
      console.error('Failed to save points:', e);
    }
  };

  if (!purchasedGames.includes('blackjack')) {
    return (
      <div className="min-h-screen container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">ブラックジャック</h1>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 p-4">
      <div className="container mx-auto">
        {/* ヘッダー部分 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-white">Blackjack</h1>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <span className="text-2xl font-bold text-white">{point}P</span>
            </div>
            <button 
              onClick={handleReturnToGameSelect}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg 
                hover:bg-white/30 transition-all duration-300"
            >
              ゲーム選択に戻る
            </button>
          </div>
        </div>

        {/* ゲームエリア */}
        <div className="max-w-5xl mx-auto space-y-8">
          {/* 初期画面 */}
          {playerHand.length === 0 && !gameOver && (
            <div className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h2 className="text-3xl font-bold text-white mb-4">ブラックジャックへようこそ！</h2>
              <p className="text-xl text-white/80 mb-6">
                勝てば20ポイント獲得、負けると10ポイント失います。引き分けは5ポイント獲得です。
              </p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-green-500 text-white text-xl rounded-lg
                  hover:bg-green-600 hover:transform hover:scale-105 
                  transition-all duration-300 shadow-lg"
              >
                ゲームを開始
              </button>
            </div>
          )}

          {/* ゲーム画面 */}
          {playerHand.length > 0 && (
            <>
              {/* ディーラーのエリア */}
              <div className="bg-white/5 backdrop-blur-sm p-4 md:p-8 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Dealer&apos;s Hand</h2>
                  <span className="text-lg md:text-xl text-white/80">
                    {gameStatus === 'dealerTurn' || gameOver
                      ? `Score: ${calculateScore(dealerHand)}`
                      : `Visible: ${calculateVisibleScore()}`
                    }
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                  {dealerHand.map((card, index) => (
                    <Card
                      key={index}
                      card={card}
                      isHidden={index > 0 && gameStatus === 'playing'}
                      isDealing={isDealing}
                      isFlipping={isFlipping && index > 0}
                    />
                  ))}
                </div>
              </div>

              {/* プレイヤーのエリア */}
              <div className="bg-white/5 backdrop-blur-sm p-4 md:p-8 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Your Hand</h2>
                  <span className="text-lg md:text-xl text-white/80">
                    Score: {calculateScore(playerHand)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-8">
                  {playerHand.map((card, index) => (
                    <Card
                      key={index}
                      card={card}
                      isHidden={false}
                      isDealing={isDealing}
                      isFlipping={false}
                    />
                  ))}
                </div>

                {/* アクションボタン */}
                {!gameOver && gameStatus === 'playing' && (
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                      onClick={hit}
                      disabled={isDealing}
                      className={`
                        px-6 py-3 md:px-8 md:py-4 bg-blue-500 text-white text-lg md:text-xl rounded-lg
                        hover:bg-blue-600 transition-all duration-300 shadow-lg
                        ${isDealing ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:scale-105'}
                      `}
                    >
                      {isDealing ? '配布中...' : 'Hit'}
                    </button>
                    <button
                      onClick={stand}
                      disabled={isDealing || isFlipping}
                      className={`
                        px-6 py-3 md:px-8 md:py-4 bg-gray-500 text-white text-lg md:text-xl rounded-lg
                        hover:bg-gray-600 transition-all duration-300 shadow-lg
                        ${(isDealing || isFlipping) ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:scale-105'}
                      `}
                    >
                      {isFlipping ? 'めくり中...' : 'Stand'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ゲーム結果表示 */}
          {gameOver && (
            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl animate-fade-in">
              <p className="text-3xl font-bold text-white mb-6">{gameResult}</p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-green-500 text-white text-xl rounded-lg
                  hover:bg-green-600 hover:transform hover:scale-105 
                  transition-all duration-300 shadow-lg"
              >
                New Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}