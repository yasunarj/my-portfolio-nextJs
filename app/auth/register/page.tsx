"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserProfileState {
  email: string;
  username: string;
  password: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfileState>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const inputUserProfile = (
    value: string,
    userProfileKey: keyof UserProfileState
  ) => {
    setUserProfile((prev) => ({
      ...prev,
      [userProfileKey]: value,
    }));
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userProfile.username || !userProfile.email || !userProfile.password) {
      setError("全てのフィールドを入力してください");
      return;
    }

    if (userProfile.password.length < 8) {
      setError("パスワードは8文字以上にしてください");
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userProfile.email,
        password: userProfile.password,
      });
      
      if (authError) {
        setError(`認証の登録に失敗しました: ${authError.message} ${authData}`);
        return;
      }

      if(authData.user === null) {
        setError("認証Idがありません");
        return;
      }

      const authId = authData.user.id

      alert("確認メールを送信しました。メールを確認して、リンクをkクリックしてください");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userProfile.username,
          email: userProfile.email,
          password: userProfile.password,
          authId,
        }),
      });
      const result = await res.json();
      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push("/auth/login");
    } catch (e) {
      console.error(e);
      setError("予期せぬエラーが発生しました");
    }
  };
  return (
    <div className="flex-grow justify-center items-center h-screen-vh">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center">新規登録</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="username">ユーザー名</Label>
              <Input
                id="username"
                value={userProfile.username}
                onChange={(e) => inputUserProfile(e.target.value, "username")}
                placeholder="ユーザー名を入力"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                onChange={(e) => inputUserProfile(e.target.value, "email")}
                placeholder="メースアドレスを入力"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={userProfile.password}
                onChange={(e) => inputUserProfile(e.target.value, "password")}
                placeholder="パスワードを入力"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              登録
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
