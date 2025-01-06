"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginUserProfileProps {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [loginUserProfile, setLoginUserProfile] =
    useState<LoginUserProfileProps>({
      email: "",
      password: "",
    });
  const [error, setError] = useState<string | null>(null);

  const handleInputValue = (
    value: string,
    loginUserProfileKey: keyof LoginUserProfileProps
  ) => {
    setLoginUserProfile((prev) => ({
      ...prev,
      [loginUserProfileKey]: value,
    }));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginUserProfile.email || !loginUserProfile.password) {
      setError("全てのフォームを入力してください");
      return;
    }

    try {
      const { data: session, error: authError } =
        await supabase.auth.signInWithPassword({
          email: loginUserProfile.email,
          password: loginUserProfile.password,
        });

      if (authError) {
        setError(`ログインに失敗しました: ${authError.message} ${session}`);
        return;
      }
      router.push("/game");
    } catch (e) {
      console.error(e);
      setError("予期せぬエラーが発生しました");
    }
  };

  return (
    <div className="h-screen-vh flex justify-center items-center">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center">ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={loginUserProfile.email}
                onChange={(e) => handleInputValue(e.target.value, "email")}
                placeholder="メールアドレス入力"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={loginUserProfile.password}
                onChange={(e) => handleInputValue(e.target.value, "password")}
                placeholder="パスワード入力"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              ログイン
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
