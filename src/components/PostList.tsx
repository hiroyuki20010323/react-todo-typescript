import useFetch from '../hooks/useFetch'

type Post = {
  id: number
  title: string
  body: string
}

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5'

function PostList() {
  const status = useFetch<Post[]>(POSTS_URL)

  switch (status.kind) {
    case 'loading':
      return <p>読み込み中...</p>
    case 'error':
      return <p>エラー: {status.message}</p>
    case 'success':
      return (
        <ul>
          {status.data.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )
  }
}

export default PostList
