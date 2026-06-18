import type { FetchStatus } from '../types/FetchStatus'

type FetchViewProps<T> = {
  status: FetchStatus<T>
  children: (data: T) => React.ReactNode
}

function FetchView<T>({ status, children }: FetchViewProps<T>) {
  switch (status.kind) {
    case 'loading':
      return <p>読み込み中...</p>
    case 'error':
      return <p>エラー: {status.message}</p>
    case 'success':
      return <>{children(status.data)}</>
  }
}

export default FetchView
