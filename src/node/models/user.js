/**
 * Created by timur on 9/9/16.
 */

import mongoose from 'mongoose'
import Promise from 'bluebird'
import log from 'gutil-color-log'
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))


const UserSchema = new mongoose.Schema({
  
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  password: {
    type: String,
    required: true
  }
})

// authenticate user

UserSchema.statics.authenticate = function (name, password, callback) {
  
  // console.log(this)
  
  const user = User.findOne({ name })
  
  
  
  log('cyan', user)
  
  // .then(function(user) {
  //   console.log(user)
  // })
  // .exec(function (err, user) {
  //
  //   console.log(user)
  //
  //   if (err) {
  //     console.log(user)
  //     return callback(err)
  //   } else if (!user) {
  //     return callback(new Error('User not found!'))
  //   } else {
  //     bcrypt.compareAsync(password, user.password)
  //       .then(authenticated => {
  //
  //         log('cyan', authenticated)
  //
  //         if (authenticated) {
  //           return callback(null, user)
  //         } else {
  //           return callback()
  //         }
  //       })
  //     // .catch(e => log('red', e))
  //   }
  // })
}

// hash password before saving
UserSchema.pre('save', function (next) {
  
  const user = this
  // let loaded = 0
  
  bcrypt.genSaltAsync(10)
    .then(salt => bcrypt.hashAsync(user.password, salt, () => {
      // log('cyan', `progress ${loaded++}`))
    }))
    .then(hash => {
      user.password = hash
      next()
    })
    .catch(e => log('red', e))
})

const User = mongoose.model('User', UserSchema)

export default User
