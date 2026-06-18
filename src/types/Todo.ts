export type Priority = 'high' | 'medium' | 'low'

export type Todo = {
  id: number
  text: string
  done: boolean
  priority: Priority
}

export type NewTodo = {
  text: string
  priority: Priority
}
