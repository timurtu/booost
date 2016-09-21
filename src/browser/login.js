/**
 * Created by timur on 9/7/16.
 */

import dom from 'domali'
import { ipcRenderer } from 'electron'

import { blame } from './utils'


dom.getId('signup-button').onclick = () => ipcRenderer.send('signup')

dom.getId('login-form').onsubmit = function (event) {
  
  event.preventDefault()
  
  const user = Array.prototype.map.call(event.target, targ => {
    
    switch (targ.value.trim()) {
      
      // Ignore this preset value
      case 'Log in':
        return null
        break
  
      // The user left a field blank
      case '':
        blame(targ, `The ${targ.get('id')} field is required.`)
        return
        break
      
      default:
        targ.style.borderLeft = 'none'
        return targ.value
    }
  })
    .filter(x => x !== null && x !== undefined)
  
  // The user didn't fill out all fields
  if (user.length < 2) {
    return
  }
  
  const [ name, password ] = user
  
  const nameCriteria = name.length >= 6 && name.length <= 12
  const passwordCriteria = password.length >= 6 && password.length <= 20
  
  if (!nameCriteria) {
    alert('Username must be 6 characters to 12 characters!')
    return
  } else if (!passwordCriteria) {
    alert('Password must be 6 characters to 20 characters!')
    return
  }
  
  const userData = { name, password }
  
  ipcRenderer.send('authenticate', userData)
}

ipcRenderer.on('error', msg => {
  alert(msg)
})

ipcRenderer.on('logged-in', () => {
  ipcRenderer.send('start-game')
})
