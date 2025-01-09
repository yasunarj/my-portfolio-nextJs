"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { House } from "lucide-react"

const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        setIsLoggedIn(!!session?.session);
      } catch (e) {
        console.error("予期せぬエラーが発生しました", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );
    return () => {
      subscription?.subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウトに失敗しました:", error);
    } else {
      alert("ログアウトしました");
      setIsLoggedIn(false);
      router.push("/");
      router.refresh();
      // window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center h-[54px]">
        <Link href="/">
          <h2 className="text-xl font-semibold">Nari Game</h2>
        </Link>
        <p>確認中</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center h-[54px]">
      <Link href="/">
        <h2 className="flex space-x-1 items-center text-xl font-semibold">
          <House size={24} />
          <span>Nari Game</span>
        </h2>
      </Link>
      <div>
        {isLoggedIn ? (
          <button
            className="text-sm hover:bg-gray-900 w-24 h-[54px]"
            onClick={handleLogout}
          >
            ログアウト
          </button>
        ) : (
          <div>
            <Link href="/auth/login">
              <button className="text-sm hover:bg-gray-900 w-24 h-[54px]">
                ログイン
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="text-sm hover:bg-gray-900 w-24 h-[54px]">
                新規登録
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
