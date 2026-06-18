import { useState } from 'react'
import type { Todo, NewTodo } from '../types/Todo'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (newTodo: NewTodo) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), done: false, text: newTodo.text, priority: newTodo.priority },
    ])
  }

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const remainingCount = todos.filter((todo) => !todo.done).length

  return { todos, addTodo, toggleTodo, deleteTodo, remainingCount }
}
