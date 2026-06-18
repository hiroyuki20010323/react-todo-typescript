import type { Todo } from '../types/Todo'
import { priorityColor } from '../constants/priority'

type TodoItemProps = {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span
        style={{
          color: priorityColor[todo.priority],
          textDecoration: todo.done ? 'line-through' : 'none',
        }}
      >
        {todo.text}
      </span>
      {todo.done && (
        <button type="button" onClick={() => onDelete(todo.id)}>
          削除
        </button>
      )}
    </li>
  )
}

export default TodoItem
