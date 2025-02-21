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
        { 
          auth_id: authId, 
          value: point,
          updated_at: new Date().toISOString()
        },
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
    console.error('Error in savePointToDatabase:', e);
    return false;
  }
}

export async function getPointFromDatabase(authId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('value')
      .eq('auth_id', authId)
      .single();

    if (error) {
      console.warn('Error fetching points:', error);
      return null;
    }

    return data?.value ?? null;
  } catch (e) {
    console.error('Error in getPointFromDatabase:', e);
    return null;
  }
} 