import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-100 to-primary-200">
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-800 mb-6 animate-fade-in">
          Welcome to Game Center
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-600 mb-12 animate-slide-in">
          ジャンケンでポイントを獲得して、新しいゲームを解放しよう！
        </p>

        <div className="space-y-4 animate-fade-in">
          <Link
            href="/auth/login"
            className="inline-block px-8 py-4 bg-primary-500 text-white rounded-lg shadow-lg hover:bg-primary-600 transition-colors text-lg"
          >
            ゲームを始める
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-primary-700 mb-4">ジャンケン</h2>
            <p className="text-gray-600">
              コンピュータと対戦してポイントを獲得！
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-primary-700 mb-4">オセロ</h2>
            <p className="text-gray-600">
              戦略的な思考が求められる定番ゲーム
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-primary-700 mb-4">ブラックジャック</h2>
            <p className="text-gray-600">
              運と判断力が試されるカードゲーム
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
