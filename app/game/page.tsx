"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useGamePoints } from '@/hooks/useGamePoints';

const games = [
  {
    id: 'janken',
    title: 'ジャンケン',
    description: 'シンプルで楽しい！運と戦略のジャンケンゲーム',
    price: 0,
    icon: '✌️👊',
    color: 'from-blue-500 to-blue-600',
    free: true
  },
  {
    id: 'blackjack',
    title: 'ブラックジャック',
    description: '定番カジノゲーム！21を目指せ',
    price: 50,
    icon: '♠️♦️',
    color: 'from-green-500 to-green-600',
    free: false
  },
  {
    id: 'othello',
    title: 'オセロ',
    description: '頭脳戦の王道！AI対戦で腕を磨こう',
    price: 100,
    icon: '⚫️ ⚪️',
    color: 'from-purple-500 to-purple-600',
    free: false
  },
];

const GamePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("ゲスト");
  const purchasedGames = useSelector((state: RootState) => state.games.purchasedGames);
  const point = useSelector((state: RootState) => state.janken.point);
  const { fetchPoints } = useGamePoints();

  // セッションチェック
  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();

      if (!session || !session.session) {
        router.push("/auth/login");
        return;
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // ユーザー情報を取得する関数
  const fetchUserData = useCallback(async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.email) {
        const name = user.user.email.split('@')[0];
        setUsername(name);
      }
    } catch (e) {
      console.warn('Failed to fetch user data:', e);
    }
  }, []);

  // 初期データ取得とリロードチェック
  useEffect(() => {
    checkSession();
    fetchUserData();
    fetchPoints();

    // リロードフラグをチェック
    const shouldReload = sessionStorage.getItem('shouldReload');
    if (shouldReload === 'true') {
      sessionStorage.removeItem('shouldReload');
      window.location.reload();
    }
  }, [checkSession, fetchUserData, fetchPoints]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl text-gray-600 font-bold animate-pulse">
          読み込み中・・・
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">
            ようこそ、<span className="text-primary-400">{username}</span> さん
          </h1>
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
            <span className="text-2xl font-bold text-white">{point}P</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            ゲームを選択してください
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {games.map((game) => (
              <div
                key={game.id}
                className="relative group"
              >
                <div className={`
                  h-full bg-gradient-to-br ${game.color} rounded-2xl p-6
                  transform transition-all duration-300 group-hover:scale-105
                  shadow-xl group-hover:shadow-2xl
                `}>
                  <div className="text-6xl mb-4">{game.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {game.title}
                  </h3>
                  <p className="text-white/80 mb-6">
                    {game.description}
                  </p>
                  {game.free || purchasedGames.includes(game.id) ? (
                    <Link
                      href={`/game/${game.id}?username=${username}`}
                      className="inline-block w-full px-6 py-3 bg-white/20 backdrop-blur-sm
                        text-white text-center rounded-lg font-semibold
                        hover:bg-white/30 transition-all duration-300"
                    >
                      {game.free ? '無料でプレイ' : 'プレイする'}
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-white/90 font-semibold">
                        価格: {game.price}P
                      </p>
                      <Link
                        href="/shop"
                        className="inline-block w-full px-6 py-3 bg-white/20 backdrop-blur-sm
                          text-white text-center rounded-lg font-semibold
                          hover:bg-white/30 transition-all duration-300"
                      >
                        購入する
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r 
              from-primary-500 to-primary-600 text-white text-xl rounded-lg
              hover:from-primary-600 hover:to-primary-700 transform hover:scale-105
              transition-all duration-300 shadow-lg"
          >
            <span className="text-2xl">🛍️</span>
            <span className="font-bold">ショップへ移動</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
