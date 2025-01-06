# TODO List

## やること
[] ロゴのマークをiconsを利用して表示させる（ホーム・ログイン・ログアウト・新規登録）
[] 画面をリッチにして見た目を整える
[] 404と400のコードの違いは何か、500の意味は何かを聞く
[] スキーマのcuidとuuidは何が違うか効く
[] 今回はreactベースのため、あまりuse serverを使用できていないため、formをserverに変更してみる

## 完了済み
[×] apiファイルがuserとuser/detailに分かれているので、それを１つに統合する。
[×] 統合できたらdetailは削除する
[×] クライアント側もfetchの機能を２つから１つにまとめる。
[×] gameページをgameselectページにしてゲームを選択できるように変更する

##ジャンケンゲームの設計について

1. UI設計
プレイヤーと対戦相手のジャンケンカード
プレイヤー：画面下部に自分のカードを表示。
対戦相手：画面上部にカードを表示（ランダム選択 or 自動選択）。
カードの配置と選択
カードは3種類（グー、チョキ、パー）を3枚ずつ。
プレイヤーが1枚カードをクリックして選択。
対戦相手のカードはランダムで選択される。
勝負ボタン
「勝負する」ボタンを押すと、選択したカードがテーブルに表示され、勝敗が判定される。
ポイント表示
現在のスコアをリアルタイムで表示。
データベースに保存されたスコアを初期値として読み込み、ゲームのたびに加算。

2. ロジック設計
勝敗判定
ジャンケンのルールを実装:
グー > チョキ
チョキ > パー
パー > グー
同じカードは引き分け。
ポイント加算
勝利：10ポイント。
引き分け・負け：ポイント加算なし。
データベースへの保存
勝利ポイントはデータベースに保存。
プレイヤーのスコアを管理するテーブルを使用（例：Scoreテーブル）。

3. 実装例
ジャンケンロジック
typescript
コードをコピーする
const determineWinner = (playerCard: string, opponentCard: string): string => {
  if (playerCard === opponentCard) return "draw"; // 引き分け

  if (
    (playerCard === "グー" && opponentCard === "チョキ") ||
    (playerCard === "チョキ" && opponentCard === "パー") ||
    (playerCard === "パー" && opponentCard === "グー")
  ) {
    return "win"; // 勝利
  }

  return "lose"; // 敗北
};
ポイントの加算
typescript
コードをコピーする
const updateScore = async (points: number) => {
  const response = await fetch("/api/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ points }),
  });

  if (!response.ok) {
    console.error("ポイントの更新に失敗しました");
    return;
  }

  console.log("ポイントが更新されました");
};
画面構成の例
上部：相手のカード。
中央：テーブル（選択されたカードを表示）。
下部：プレイヤーのカードと勝負ボタン。
4. 実装の流れ
UIの構築:
Tailwind CSSなどでジャンケンカードやボタンを作成。
ゲームロジックの実装:
determineWinner関数で勝敗を判定。
スコア管理:
データベースにスコアを保存するAPIを実装。
統合:
カード選択 → 勝負ボタン押下 → 勝敗表示 → スコア更新の流れを作成。

保険コード
model User {
  id        String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid 
  authId    String    @unique
  username  String    @unique
  email     String    @unique
  password  String 
  scores    Score[]
  createdAt  DateTime  @default(now())
}

model Score {
  id        String    @id @default(cuid())
  value     Int
  userId    String    @db.Uuid
  user      User      @relation(fields: [userId], references: [id])
  createdAt  DateTime  @default(now())
}

use server側でのsupabase認証idが取得できなかった。
cookiesを利用するようだが、うまくいかずに結局クライアント側で取得した認証idをserver側で渡すような処理となった。。

