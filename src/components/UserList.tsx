import useFetch from '../hooks/useFetch'
import FetchView from './FetchView'

type User = {
  id: number
  name: string
  email: string
}

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

function UserList() {
  const status = useFetch<User[]>(USERS_URL)

  return (
    <FetchView status={status}>
      {(users) => (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name}（{user.email}）
            </li>
          ))}
        </ul>
      )}
    </FetchView>
  )
}

export default UserList
