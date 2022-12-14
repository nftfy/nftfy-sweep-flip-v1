import { notification } from 'antd'

interface SetToastProps {
  data: {
    title: string
    message: string
  }
}

export const setToast: (data: SetToastProps['data']) => any = data =>
  notification.open({
    message: data.title,
    description: data.message,
    placement: 'topRight',
    duration: 7
  })
