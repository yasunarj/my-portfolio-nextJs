"use client";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface Product {
  name: string;
  price: number;
  rock: boolean;
}

type ProductList = Product[];

const productList: ProductList = [
  {
    name: "OthelloGame",
    price: 100,
    rock: true,
  },
  {
    name: "BlackJackGame",
    price: 100,
    rock: true,
  },
];


const ShopPage = () => {
  const { point } = useSelector((state: RootState) => state);

  const handleBuy = (name: string) => {
    const result = confirm(`${name}を購入しますか?`);
    if(!result) {
      alert("購入をキャンセルしました");
    }
    if(point < 100) {
      alert("pointが足りません");
    } else {
      alert("ゲームを購入しました(まだ作ってないけど。。。)");
    }
  }
  return (
    <div
      className="flex-grow flex flex-col items-center text-xl bg-center bg-cover"
      style={{
        backgroundImage: "url('/images/photo-1579546928686-286c9fbde1ec.avif')",
      }}
    >
      <div className="border-double border-8 p-4 w-[80%] h-[70%] mt-12">
        <h2 className="font-semibold text-center my-6">🎁-Shop List-🎁</h2>
        <ul className="flex flex-col space-y-4">
          {productList.map((item) => {
            return (
              <li key={item.name} className="flex justify-between">
                <h3>{item.name}</h3>
                <p className="underline underline-offset-2 text-blue-800" onClick={() => handleBuy(item.name)}>{`$${item.price} points`}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <h1 className="text-3xl font-bold underline mt-4">
        Yours points
        <span className="text-blue-800 text-4xl">{` ${point}`}</span>
      </h1>
    </div>
  );
};

export default ShopPage;