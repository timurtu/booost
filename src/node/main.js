/**
 * Created by timur on 9/4/16.
 */

import log from 'gutil-color-log'
import { app, BrowserWindow, ipcMain, session } from 'electron'

import User from './models/user'
import mongoose from 'mongoose'
mongoose.Promise = require('bluebird')
import { addWindow } from './windows'


let windows = []

let loginWindow = () => {
  
  const name = 'login'
  const window = addWindow(name, 600, 420, false, true)
  
  windows = windows.concat([{ name, window }])
  return window
}

app.on('ready', () => {
  
  
  // let win = new BrowserWindow({ width: 800, height: 600 })
  // win.loadURL('http://github.com')
  //
  // const ses = win.webContents.session
  // console.log(ses)
  // const {session} = require('electron')
  // const ses = session.fromPartition('persist:name')
  // console.log(ses.getUserAgent())
  
  let signupWindow = () => {
    
    const name = 'signup'
    const window = addWindow(name, 400, 540, false, true)
    
    windows = windows.concat([{ name, window }])
    return window
  }
  
  let login = loginWindow()
  
  ipcMain.on('signup', () => {
    
    login.close()
    let signup = signupWindow()
    
    ipcMain.on('user-created-confirmed', () => {
      signup.close()
    })
    
    signup.on('closed', () => {
      login = loginWindow()
    })
  })
})

ipcMain.on('new-user', (event, userData) => {
  
  User.create(userData, err => {
    
    if (err) {
      event.sender.send('server-error', { userData, err })
    } else {
      event.sender.send('user-created', userData.name)
    }
  })
})

ipcMain.on('authenticate', (event, { name, password }) => {
  
  // console.log('successful attempt with ')
  // console.log('name', name)
  // console.log('password', password)
  
  User.authenticate(name, password, function (error, user) {
    if(error || !user) {
      throw new Error('Wrong username or password.')
    } else {
      log('red', `${user.name} logged in.`)
    }
  })
  
  // .catch(e => log('red', e))
  
  // event.sender.send('logged-in')
})

ipcMain.on('start-game', () => {
  
  addWindow('game', 960, 580, true, true)
})

app.on('window-all-closed', () => {
  
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  
  loginWindow()
})
