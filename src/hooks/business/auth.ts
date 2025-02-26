import {useAuthStore} from '@/store/modules/auth'

export function useAuth() {
  const authStore = useAuthStore()

  function hasAuth(codes: string | string[]) {
    return authStore.isLogin
  }

  return {
    hasAuth,
  }
}
