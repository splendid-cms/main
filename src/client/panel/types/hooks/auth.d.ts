type UseAuth = [
  string | true,
  (username: string, password: string) => Promise<number>,
  () => void
]