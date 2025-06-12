import { useMemoizedFn } from 'ahooks'

export const useClick = () => {
  const handleSendClick = useMemoizedFn(() => {
    console.log('Send clicked')
  })

  const handleReceiveClick = useMemoizedFn(() => {
    console.log('Receive clicked')
  })

  return { handleSendClick, handleReceiveClick }
}
