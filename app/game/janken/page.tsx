"use client";

import JankenMain from "@/components/jankenMain";
import MainHeader from "@/components/main_header";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { resetGame } from "@/redux/slices/jankenSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useRouter } from "next/navigation";

const JankenGamePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "ゲスト";
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();
  
  const { point, authId } = useSelector((state: RootState) => state);
  const saveScore = async () => {
    setIsSaving(true);
    dispatch(resetGame());
    try {
      const res = await fetch("/api/scores", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authId,
          value: point,
        }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/game");
      } else {
        throw new Error("スコアの保存に失敗しました");
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsSaving(false);
      
    }
  };

  if (isSaving) {
    return (
      <div className="h-screen-vh">
        <div className="h-[80%] flex justify-center items-center text-xl text-gray-600 font-bold">
          データを保存中です
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen-vh flex flex-col items-center justify-between py-2">
      {errorMessage ? (
        <div className="text-red-500 font-semibold text-sm sm:text-xl">{errorMessage}</div>
      ) : (
        <div className="relative w-full flex justify-center items-center">
          <h2 className="font-semibold text-sm sm:text-xl text-gray-700 underline underline-offset-4">
            CPU Side
          </h2>
          <button
            className="absolute top-[48%] right-4 text-sm sm:text-xl text-gray-700"
            onClick={saveScore}
          >
            ゲーム一覧へ
          </button>
        </div>
      )}

      <JankenMain />

      <div className="flex">
        <MainHeader username={username} />
        <p className="absolute text-md right-10 font-semibold sm:text-xl text-gray-700">{`Score: ${point}pt`}</p>
      </div>
    </div>
  );
};

export default JankenGamePage;
