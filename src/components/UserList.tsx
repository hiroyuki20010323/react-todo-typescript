import useFetch from '../hooks/useFetch'

type User = {
  id: number
  name: string
  email: string
}

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

function UserList() {
  const status = useFetch<User[]>(USERS_URL)

  switch (status.kind) {
    case 'loading':
      return <p>読み込み中...</p>
    case 'error':
      return <p>エラー: {status.message}</p>
    case 'success':
      return (
        <ul>
          {status.data.map((user) => (
            <li key={user.id}>
              {user.name}（{user.email}）
            </li>
          ))}
        </ul>
      )
  }
}

export default UserList
