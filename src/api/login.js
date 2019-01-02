import fetch from 'utils/fetch'
import { param } from '@/utils'

export function loginByEmail (email, password) {
  const data = {
    email,
    password
  };
  return fetch({
    url: '/login/loginbyemail',
    method: 'post',
    data
  })
}

export function LoginByUsername (username, password) {
  const data = {
    username: username,
    password: password
  }
  return fetch({
    url: 'api/login',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    transformRequest: param,
    data
  })
}

export function logout () {
  return fetch({
    url: '/login/logout',
    method: 'post'
  })
}

export function getInfo (token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

