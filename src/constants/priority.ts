import type { Priority } from '../types/Todo'

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export const priorityColor: Record<Priority, string> = {
  high: '#e53e3e',
  medium: '#dd6b20',
  low: '#38a169',
}
