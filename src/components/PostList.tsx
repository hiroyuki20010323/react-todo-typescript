import useFetch from '../hooks/useFetch'
import FetchView from './FetchView'

type Post = {
  id: number
  title: string
  body: string
}

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5'

function PostList() {
  const status = useFetch<Post[]>(POSTS_URL)

  return (
    <FetchView status={status}>
      {(posts) => (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </FetchView>
  )
}

export default PostList
