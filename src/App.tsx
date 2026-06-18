import './App.css'
import { useTodos } from './hooks/useTodos'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import UserList from './components/UserList'
import PostList from './components/PostList'

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, remainingCount } = useTodos()

  return (
    <div className="app">
      <section>
        <h1>型付き Todo アプリ</h1>
        <TodoForm onAdd={addTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        <p>残り: {remainingCount} 件</p>
      </section>

      <section>
        <h2>ユーザー一覧</h2>
        <UserList />
      </section>

      <section>
        <h2>投稿一覧</h2>
        <PostList />
      </section>
    </div>
  )
}

export default App
