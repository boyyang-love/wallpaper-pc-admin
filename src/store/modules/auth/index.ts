import {computed, reactive, ref} from 'vue'
import {useRoute} from 'vue-router'
import {defineStore} from 'pinia'
import {useLoading} from '@sa/hooks'
import {SetupStoreId} from '@/enum'
import {useRouterPush} from '@/hooks/common/router'
import {fetchLogin} from '@/service/api'
import {localStg} from '@/utils/storage'
import {$t} from '@/locales'
import {useRouteStore} from '../route'
import {useTabStore} from '../tab'
import {clearAuthStorage, getToken} from './shared'

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute()
  const routeStore = useRouteStore()
  const tabStore = useTabStore()
  const {toLogin, redirectFromLogin} = useRouterPush(false)
  const {loading: loginLoading, startLoading, endLoading} = useLoading()

  const token = ref(getToken())

  let userInfo: Api.Auth.UserInfo = reactive({
    address: '',
    avatar: '',
    cover: '',
    email: '',
    gitHub: '',
    id: '',
    motto: '',
    qq: '',
    role: '',
    tel: '',
    username: '',
    wechat: '',
  })

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const {VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE} = import.meta.env

    return VITE_AUTH_ROUTE_MODE === 'static' && [userInfo.role].includes(VITE_STATIC_SUPER_ROLE)
  })

  /** Is login */
  const isLogin = computed(() => Boolean(token.value))

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore()

    clearAuthStorage()

    authStore.$reset()

    if (!route.meta.constant) {
      await toLogin()
    }

    tabStore.cacheTabs()
    await routeStore.resetStore()
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading()
    const {data: loginToken, error} = await fetchLogin(userName, password)
    if (!error) {
      const pass = await loginByToken(loginToken)
      userInfo = loginToken.user_info

      if (pass) {
        await redirectFromLogin(redirect)

        window.$notification?.success({
          title: $t('page.login.common.loginSuccess'),
          content: $t('page.login.common.welcomeBack', {userName: userInfo.username}),
          duration: 4500,
        })
      }
    } else {
      await resetStore()
    }

    endLoading()
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    localStg.set('token', loginToken.token)
    token.value = loginToken.token
    return true
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
  }
})
