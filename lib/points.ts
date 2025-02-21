import { supabase } from "./supabaseClient";

export async function savePointToDatabase(authId: string, point: number) {
  try {
    // バリデーション
    if (!authId || typeof point !== 'number') {
      console.warn('Invalid input:', { authId, point });
      return false;
    }

    const { error } = await supabase
      .from('scores')
      .upsert(
        { auth_id: authId, value: point },
        { onConflict: 'auth_id' }
      );

    if (error) {
      // より詳細なエラー情報をログに出力
      console.warn('Database error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      return false;
    }

    // 成功時のログ
    console.log('Points saved successfully:', { authId, point });
    return true;
  } catch (e) {
    // エラーオブジェクトの型を確認して適切に処理
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.warn('Unexpected error in savePointToDatabase:', errorMessage);
    return false;
  }
} 