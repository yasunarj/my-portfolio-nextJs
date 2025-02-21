export const games = [
  {
    id: 'janken',
    name: 'ジャンケン',
    path: '/game/janken',
    description: 'ポイントを獲得してゲームを購入しよう！'
  },
  {
    id: 'othello',
    name: 'オセロ',
    path: '/game/othello',
    description: '定番の戦略ボードゲーム'
  },
  {
    id: 'blackjack',
    name: 'ブラックジャック',
    path: '/game/blackjack',
    description: '人気のカードゲーム'
  }
] as const;