import { useState } from 'react'
import type { NewTodo, Priority } from '../types/Todo'
import { PRIORITY_OPTIONS } from '../constants/priority'

type TodoFormProps = {
  onAdd: (todo: NewTodo) => void
}

function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (trimmed === '') return
    onAdd({ text: trimmed, priority })
    setText('')
    setPriority('medium')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Todo を入力してください"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="submit">追加</button>
    </form>
  )
}

export default TodoForm
