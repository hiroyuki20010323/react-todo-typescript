import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { userSchema } from '../schemas/userSchema'
import { createUser } from '../server/userRouter'

const schema = userSchema
  .extend({
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirm'],
  })

type FormValues = z.infer<typeof schema>

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { passwordConfirm: _passwordConfirm, ...payload } = data
    const result = await createUser(payload)
    console.log(result)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>名前</label>
        <input {...register('name')} placeholder="山田太郎" />
        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
      </div>

      <div>
        <label>メールアドレス</label>
        <input {...register('email')} type="email" placeholder="test@example.com" />
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
      </div>

      <div>
        <label>パスワード</label>
        <input {...register('password')} type="password" />
        {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
      </div>

      <div>
        <label>パスワード（確認）</label>
        <input {...register('passwordConfirm')} type="password" />
        {errors.passwordConfirm && (
          <p style={{ color: 'red' }}>{errors.passwordConfirm.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送信中...' : '登録する'}
      </button>
    </form>
  )
}

export default App