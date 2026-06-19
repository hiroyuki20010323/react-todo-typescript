import { z } from 'zod'
import { userSchema } from '../schemas/userSchema'

export async function createUser(body: unknown) {
  // safeParse: 値がスキーマに合うか検証する。parse と違い失敗しても例外を投げず、
  // { success: true, data } か { success: false, error } のどちらかを返す。
  const parsed = userSchema.safeParse(body)

  if (!parsed.success) {
    // flattenError: 読みにくい ZodError を { formErrors, fieldErrors } に整形する。
    // fieldErrors は { email: ['メール...'], password: ['8文字...'] } のような
    // 「フィールド名 → エラーメッセージ配列」のオブジェクト。
    return { ok: false , errors: z.flattenError(parsed.error).fieldErrors }
  }

  // password はレスポンスに含めない（フロントに漏らさない）。残りだけ返す。
  const { password: _password, ...user } = parsed.data
  return { ok: true, user }
}
