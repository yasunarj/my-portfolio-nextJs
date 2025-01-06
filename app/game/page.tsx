"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import MainHeader from "@/components/main_header";
import { games } from "@/lib/games";
import { setPoint } from "@/redux/slices/jankenSlice";
import { useDispatch } from "react-redux";
import { setAuthId } from "@/redux/slices/jankenSlice";

const GamePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState<string>("No one here・・・");

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data: session } = await supabase.auth.getSession();

    if (!session || !session.session) {
      setIsLoading(false);
      router.push("/auth/login");
      return;
    }

    try {
      const token = session.session?.access_token;
  
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`エラーが発生しました: ${response.status} ${response.statusText}`)
      }
  
      const result = await response.json();
      setUser(result);
      setUsername(result.user);
    } catch(e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);


  const fetchPoint = useCallback(async () => {
    try {
      const { data: user, error } = await supabase.auth.getUser();

      if(error) {
        return;
      }

      const authId = user.user.id;
      dispatch(setAuthId(authId));
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authId }),
      });

      const data = await res.json();
      if(data.success) {
        dispatch(setPoint(data.score.value));
      } else {
        console.error("ポイント取得エラー", data.error)
      }
    } catch (e) {
      console.error("ポイント取得失敗", e);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchPoint()
  }, [fetchPoint]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        読み込み中・・・
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center">
      {user ? (
        <div className="">
          <MainHeader username={username} />
          <ul className="flex flex-col justify-center text-2xl text-blue-700 font-bold space-y-4 h-[75%]">
            {games.map((game) => {
              return (
                <li
                  key={game.name}
                  className="cursor-pointer hover:text-gray-700 hover:underline"
                >
                  <Link href={{ pathname: game.path, query: { username } }}>
                    {game.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p>ユーザーが見つかりません。</p>
      )}
    </div>
  );
};

export default GamePage;
