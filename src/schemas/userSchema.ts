import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, '2文字以上で入力してください'),
  email: z.string().email('メールアドレスの形式で入力してください'),
  password: z.string().min(8, '8文字以上で入力してください'),
})

export type UserInput = z.infer<typeof userSchema>
