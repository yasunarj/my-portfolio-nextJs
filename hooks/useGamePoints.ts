import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPoint } from '@/redux/slices/jankenSlice';
import { supabase } from '@/lib/supabaseClient';

const INITIAL_POINTS = 100;

export function useGamePoints() {
  const dispatch = useDispatch();

  // ポイントを取得
  const fetchPoints = useCallback(async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) {
        console.warn('User not found');
        return;
      }

      // APIを使用してスコアを取得
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authId: user.user.id }),
      });

      if (!res.ok) {
        console.warn(`API warning: ${res.status}`);
        return;
      }

      const data = await res.json();
      
      if (data?.success && data?.score) {
        // 既存のスコアがある場合
        dispatch(setPoint(data.score.value));
      } else {
        // 新規ユーザーの場合は初期ポイントを設定
        dispatch(setPoint(INITIAL_POINTS));
        
        // APIを使用して初期ポイントを保存
        const saveRes = await fetch("/api/scores", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            authId: user.user.id, 
            value: INITIAL_POINTS 
          }),
        });

        if (!saveRes.ok) {
          console.warn('Failed to save initial points');
        }
      }
    } catch (e) {
      console.error('Error fetching points:', e);
    }
  }, [dispatch]);

  // ポイントを保存
  const savePoints = useCallback(async (points: number) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) {
        console.warn('User not found');
        return;
      }

      // APIを使用してポイントを保存
      const res = await fetch("/api/scores", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          authId: user.user.id, 
          value: points 
        }),
      });

      if (!res.ok) {
        console.warn('Failed to save points');
        return;
      }

      const data = await res.json();
      if (!data.success) {
        console.warn('Failed to save points:', data.message);
      }
    } catch (e) {
      console.error('Error saving points:', e);
    }
  }, []);

  const savePointsAndReload = useCallback(async (points: number) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) {
        console.warn('User not found');
        return;
      }

      // APIを使用してポイントを保存
      const res = await fetch("/api/scores", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          authId: user.user.id, 
          value: points 
        }),
      });

      if (!res.ok) {
        console.warn('Failed to save points');
        return;
      }

      // ポイントの保存が成功したら、リロードのフラグをセット
      sessionStorage.setItem('shouldReload', 'true');
      
      // 現在のポイントをReduxストアに反映
      dispatch(setPoint(points));

      // 少し待ってからゲーム選択画面に遷移
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = '/game';
      
    } catch (e) {
      console.error('Error saving points:', e);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  return { savePoints, fetchPoints, savePointsAndReload };
} 