"use client";

import MainHeader from "@/components/main_header";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { 
  resetGame, 
  setPlayerHand, 
  setComputerHand, 
  incrementPoint, 
  decrementPoint 
} from "@/redux/slices/jankenSlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import Link from "next/link";
import { savePointToDatabase } from '@/lib/points';
import { supabase } from "@/lib/supabaseClient";

// ジャンケンの手を定義
const hands = ['✊', '✌️', '✋'] as const;
const handNames = ['グー', 'チョキ', 'パー'] as const;

const JankenGamePage = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "ゲスト";
  const dispatch = useDispatch();

  const { playerHand, computerHand, isShowingResult, point } = useSelector((state: RootState) => state.janken);

  useEffect(() => {
    dispatch(resetGame());
  }, [dispatch]);

  const handlePlayerSelect = (hand: number) => {
    dispatch(setPlayerHand(hand));
  };

  const handleBattle = () => {
    if (playerHand === null) return;
    const computer = Math.floor(Math.random() * 3);
    dispatch(setComputerHand(computer));
    
    // 勝敗に応じてポイントを更新
    if (playerHand === computer) {
      dispatch(incrementPoint(1));
    } else if ((playerHand + 1) % 3 === computer) {
      dispatch(incrementPoint(3));
    } else {
      dispatch(decrementPoint(1));
    }
  };

  const getResult = () => {
    if (playerHand === null || computerHand === null) return '';
    if (playerHand === computerHand) return '引き分け！';
    if ((playerHand + 1) % 3 === computerHand) return 'あなたの勝ち！';
    return 'コンピューターの勝ち！';
  };

  const handleReturnToGameSelect = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) {
        console.warn('User not found');
        return;
      }

      const success = await savePointToDatabase(user.user.id, point);
      if (!success) {
        console.warn('Failed to save points');
      }
    } catch (e) {
      console.warn('Error in handleReturnToGameSelect:', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <MainHeader username={username} />
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">
            <p className="text-xl font-bold text-primary-600">
              現在のポイント: {point}P
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">ジャンケンゲーム</h1>
            <p className="text-gray-600">
              勝利: +3pt | 引き分け: +1pt | 負け: -1pt
            </p>
          </div>

          <div className="space-y-12">
            {/* 対戦エリア */}
            <div className="flex justify-around items-center">
              <div className="text-center space-y-4">
                <p className="text-xl font-semibold text-gray-700">あなた</p>
                <div className={`text-7xl transform transition-all duration-300
                  ${playerHand !== null ? 'scale-110' : 'opacity-50'}`}>
                  {playerHand !== null ? hands[playerHand] : '❔'}
                </div>
                {playerHand !== null && (
                  <p className="text-lg text-gray-600">{handNames[playerHand]}</p>
                )}
              </div>

              <div className="text-4xl font-bold text-primary-500">VS</div>

              <div className="text-center space-y-4">
                <p className="text-xl font-semibold text-gray-700">コンピューター</p>
                <div className={`text-7xl transform transition-all duration-300
                  ${computerHand !== null ? 'scale-110' : 'opacity-50'}`}>
                  {computerHand !== null ? hands[computerHand] : '❔'}
                </div>
                {computerHand !== null && (
                  <p className="text-lg text-gray-600">{handNames[computerHand]}</p>
                )}
              </div>
            </div>

            {/* 結果表示 */}
            {isShowingResult && (
              <div className="text-center animate-fade-in">
                <p className="text-4xl font-bold text-primary-600 mb-4">
                  {getResult()}
                </p>
                <button
                  onClick={() => dispatch(resetGame())}
                  className="px-8 py-4 bg-primary-500 text-white text-xl rounded-lg 
                    hover:bg-primary-600 transform hover:scale-105 transition-all shadow-lg"
                >
                  もう一度遊ぶ
                </button>
              </div>
            )}

            {/* 手の選択 */}
            {!isShowingResult && (
              <div className="space-y-8">
                <div className="flex justify-center gap-8">
                  {hands.map((hand, index) => (
                    <button
                      key={index}
                      onClick={() => handlePlayerSelect(index)}
                      className={`text-6xl p-6 rounded-2xl transform transition-all duration-300
                        hover:scale-110 shadow-lg
                        ${playerHand === index 
                          ? 'bg-primary-100 ring-4 ring-primary-500' 
                          : 'hover:bg-gray-50 bg-white'}`}
                    >
                      {hand}
                      <p className="text-sm mt-2 text-gray-600">{handNames[index]}</p>
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleBattle}
                    disabled={playerHand === null}
                    className={`px-8 py-4 rounded-lg text-xl font-bold transform transition-all duration-300
                      ${playerHand === null
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-500 hover:bg-primary-600 text-white hover:scale-105 shadow-lg'}`}
                  >
                    勝負！
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/game"
            onClick={handleReturnToGameSelect}
            className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg 
              hover:bg-white/30 transition-all duration-300"
          >
            ゲーム選択に戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JankenGamePage;
