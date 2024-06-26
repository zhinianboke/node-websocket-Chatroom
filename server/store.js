const db=require("./db");
const util=require("./utils")
const fs=require('fs')
module.exports ={
  saveUser(user,status){
    console.log(user.name,status);
    if(status==='login'){
      return new Promise((resolve, reject) => {
        db.user.insert(user,(err,newUser) => {
          if(err){
            reject(err)
          }else {
            resolve(newUser)
          }
        })
      })
    }
  },
  saveMessage(from,to,message,type){
    if(type==='image'){
      const base64Data = message.replace(/^data:image\/\w+;base64,/, "")
      const dataBuffer = new Buffer.from(base64Data,'base64')
      const filename = util.MD5(base64Data)
      fs.writeFileSync(`./upload/${filename}.png`,dataBuffer)
      message=`/assets/images/${filename}.png`
    }
    console.log("\033[36m"+from.name+"\033[0m对<\033[36m"+to.name+"\033[0m>:\033[32m"+message+"\033[0m")
    const doc={
      from,
      to,
      content:message,
      type,
      time:new Date().getTime()
    }
    return new Promise((resolve, reject) => {
      db.message.insert(doc,(err,newDoc) => {
        if(err){
          reject(err)
        }else {
          resolve(newDoc)
        }
      })
    })
  },
  getMessages() {
    return new Promise((resolve, reject) => {
      db.message.find({}).sort({time:1}).skip(0).limit(1000).exec((err,docs) => {
        if(err){
          reject(err)
        }else {
          resolve(docs)
        }
      })
    })
  },
  getMessagesById(allMsg, currentId, loginId) {
    const newMsg = [];
    for (let i = 0; i < allMsg.length; i++) {
      let item = allMsg[i];
      
      if(item.to.id == currentId && item.from.id == loginId){
        newMsg.push(item);
      }

      if(item.to.id == loginId && item.from.id == currentId){
        newMsg.push(item);
      }
    }
    
    return newMsg;

    // const newResultMsg = {}
    // resultMessage.forEach((item) => {
    //   console.log("item",item);
    //   if(item.to && item.to.id != messageId){
    //     newResultMsg.push(item)
    //   }
    // })
    // return newResultMsg;
  },
  getUsers(){
    return new Promise((resolve, reject) => {
      db.user.find({}).sort({time:1}).skip(0).limit(100).exec((err,docs) => {
        if(err){
          reject(err)
        }else {
          resolve(docs)
        }
      })
    })
  },
  async getUserInfo(){
    return new Promise((resolve, reject) => {
      db.userInfo.find({}).sort({time:1}).skip(0).limit(1000).exec((err,docs) => {
        if(err){
          reject(err)
        }else {
          resolve(docs)
        }
      })
    })
  },
  saveUserInfo(allUsers, user,status){
    if(!(allUsers.some(item1 => item1.id == user.id))) {
      if(status==='login'){
        user.online=false;
        return new Promise((resolve, reject) => {
          db.userInfo.insert(user,(err,newUser) => {
            if(err){
              reject(err)
            }else {
              resolve(newUser)
            }
          })
        })
      }
    }
  },
};
