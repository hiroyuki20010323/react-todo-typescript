# 型付き Todo アプリ

TypeScript + React 19 + Vite で作る Todo アプリ。型付けの学習教材を兼ねた「お手本」として、**責務分離・型安全・YAGNI（過剰設計の回避）** を一貫した基準で設計している。

## 機能

- Todo の追加（テキスト + 優先度）
- 完了の切り替え（チェックボックス）
- 完了済み Todo の削除
- 優先度（高 / 中 / 低）の色分け表示
- ユーザー一覧 / 投稿一覧の取得（JSONPlaceholder API）

## セットアップ

```bash
npm install
npm run dev      # 開発サーバー
npm run build    # 型チェック + 本番ビルド
npm run lint     # ESLint
```

## ディレクトリ構成

```
src/
  types/
    Todo.ts          # Todo / NewTodo / Priority（複数箇所で共有する型のみ）
  constants/
    priority.ts      # 優先度の色・選択肢
  hooks/
    useTodos.ts      # Todo の状態と操作（add / toggle / delete）
    useFetch.ts      # 汎用フェッチフック + FetchStatus<T>
  components/
    TodoForm.tsx     # 入力フォーム（検証もここ）
    TodoItem.tsx     # Todo 1 件の表示
    TodoList.tsx     # 一覧の描画
    UserList.tsx     # ユーザー一覧（useFetch を利用）
    PostList.tsx     # 投稿一覧（useFetch を利用）
  App.tsx            # 各パーツの組み立て
```

---

# 設計思想

このアプリの価値はコードの量ではなく、**「なぜそう書いたか」の判断基準** にある。以下はその記録。

## 1. 状態は 1 箇所で持ち、配る（lifting state up）

Todo の状態と操作は [`useTodos`](src/hooks/useTodos.ts) に集約し、`App` がそれを呼んで子へ props で配る。

```tsx
const { todos, addTodo, toggleTodo, deleteTodo, remainingCount } = useTodos()
```

> **カスタムフックは「状態」ではなく「ロジック」を共有する。** `useTodos()` を複数の場所で呼ぶと、呼び出しごとに独立した state が生まれて共有されない（中身は `useState`）。だから状態を共有したい場合は、どこか 1 箇所で呼んでその結果を配る必要がある。`App` 経由の受け渡しはこの「配る」役割であり、冗長な中継ではなく必然。

## 2. 型は「2 箇所以上で参照されてから」切り出す

| 型 | 参照箇所 | 置き場所 |
|---|---|---|
| `Todo` / `NewTodo` / `Priority` | 複数ファイル | `types/Todo.ts` に切り出す |
| `User` | `UserList` のみ | `UserList.tsx` 内に同居 |
| `Post` | `PostList` のみ | `PostList.tsx` 内に同居 |
| `FetchStatus<T>` | `useFetch` のみ | `useFetch.ts` 内に同居（戻り値の型なので） |

> 1 箇所でしか使わない型を別ファイルに切り出すのは、まだ存在しない再利用を見越した先回り＝オーバーエンジニアリング。**使う場所に置けば定義を探してファイルを行き来せずに済む。** 2 箇所目が現れた時点で共有ファイルへ昇格させる。

## 3. バリデーションはフォームの責務

入力の検証（空チェック・前後空白の除去）は [`TodoForm`](src/components/TodoForm.tsx) で行い、空なら早期 `return` する。

```tsx
const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault()
  if (text.trim() === '') return        // 空なら何もしない
  onAdd({ text: text.trim(), priority }) // 正規化して渡す
  setText('')
  setPriority('medium')
}
```

> 早期 `return` により「空送信時にフォームだけリセットされる」副作用も同時に防げる。
> 検証を `boolean` の戻り値で呼び出し側に伝える案も検討したが、`if (!onAdd(...)) return` という分岐が増えて見通しが落ちるため却下した。**副作用が些細なら、条件分岐を増やすよりシンプルさを優先する。**

## 4. props の命名は `on〜`、データと区別する

子へ渡すコールバックは `onAdd` / `onToggle` / `onDelete`（React 慣習）。フック側の実装は `addTodo` / `toggleTodo` / `deleteTodo`。

```tsx
<TodoForm onAdd={addTodo} />
<TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
```

> `onAdd`（子から見た「追加イベント」）と `addTodo`（親の実装）は視点が違うので名前が違うのが自然。`on〜` にすることで、データ props（`todos`）とコールバック props を名前で見分けられる。
> Props の型名はコンポーネントごとに固有名にする（`TodoFormProps` など）。どのコンポーネントの props か一目で分かる。

## 5. データ取得は Discriminated Union で型安全に

[`useFetch<T>`](src/hooks/useFetch.ts) は通信状態を `FetchStatus<T>` で返し、利用側は `switch` で網羅的に分岐する。

```ts
export type FetchStatus<T> =
  | { kind: 'loading' }
  | { kind: 'success'; data: T }
  | { kind: 'error'; message: string }
```

```tsx
switch (status.kind) {
  case 'loading': return <p>読み込み中...</p>
  case 'error':   return <p>エラー: {status.message}</p>
  case 'success': return /* status.data は T に絞り込まれる */
}
```

> `idle` 状態はあえて持たない。`useFetch` はマウント時に必ず通信を始めるため `idle` は到達しないデッドケースであり、初期値を `loading` にすることで `switch` の全分岐が実際に到達可能になる。

## 6. あえて入れなかったもの（YAGNI）

| 検討したもの | 判断 | 理由 |
|---|---|---|
| Context | 入れない | prop drilling は 2 段だけ。Context はデータフローを暗黙化し、型の追跡を難しくする |
| `useFetch` のクリーンアップ（`AbortController` 等） | 入れない | URL が固定で 1 回しか取得しないため、競合（レースコンディション）が構造的に起きない。URL が動的に変わる機能を足したら導入する |
| `addTodo` の `boolean` 返し | 却下 | 呼び出し側に条件分岐を持ち込み見通しが落ちる。防ぐ副作用が些細すぎる |

> 共通しているのは「**いま必要な保険だけ掛ける**」という基準。将来の可能性に備えた抽象化は、その可能性が現実になってから足す。

## 補足: `React.SubmitEvent`

フォーム送信のイベント型は `React.SubmitEvent<HTMLFormElement>` を使う。React 19 の `@types/react` で新設された型で、従来の `FormEvent` は非推奨になっている。
