import storage from 'good-storage'
const BASE = '_<%= rootOptions.projectName %>_app_'
const USER_INFO_KEY = BASE + 'userinfo_'
const TOKEN_KEY = BASE + 'token_'

export function getUserInfo () {
  return storage.get(USER_INFO_KEY)
}

export function saveUserInfo (data) {
  storage.set(USER_INFO_KEY, data)
}

export function saveToken (token) {
  storage.set(TOKEN_KEY, token)
}

export function getToken () {
  return storage.get(TOKEN_KEY)
}

export function removeUserInfo () {
  return storage.remove(USER_INFO_KEY)
}

export function removeToken () {
  return storage.remove(TOKEN_KEY)
}
