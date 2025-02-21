'use client';

import { useDispatch, useSelector } from 'react-redux';
import { purchaseGame } from '@/redux/features/gameSlice';
import { decreasePoint } from '@/redux/slices/jankenSlice';
import { RootState } from '@/redux/store';
import Link from 'next/link';

interface Game {
  id: string;
  name: string;
  price: number;
  description: string;
}

const games: Game[] = [
  {
    id: 'othello',
    name: 'オセロ',
    price: 10,
    description: '定番の戦略ボードゲーム'
  },
  {
    id: 'blackjack',
    name: 'ブラックジャック',
    price: 10,
    description: '人気のカードゲーム'
  }
];

export default function ShopPage() {
  const dispatch = useDispatch();
  const purchasedGames = useSelector((state: RootState) => state.games.purchasedGames);
  const point = useSelector((state: RootState) => state.janken.point);

  const handlePurchase = (game: Game) => {
    if (point >= game.price) {
      dispatch(purchaseGame(game.id));
      dispatch(decreasePoint(game.price));
      alert('購入しました！');
    } else {
      alert('ポイントが足りません！');
    }
  };

  return (
    <div className="min-h-screen container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ゲームショップ</h1>
        <Link 
          href="/game" 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ゲーム選択に戻る
        </Link>
      </div>
      <p className="mb-4 text-lg">現在のポイント: {point}P</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => (
          <div key={game.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{game.name}</h2>
            <p className="text-gray-600">{game.description}</p>
            <p className="text-lg font-bold mt-2">{game.price}P</p>
            <button
              onClick={() => handlePurchase(game)}
              disabled={purchasedGames.includes(game.id)}
              className={`mt-2 px-4 py-2 rounded ${
                purchasedGames.includes(game.id)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {purchasedGames.includes(game.id) ? '購入済み' : '購入する'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 