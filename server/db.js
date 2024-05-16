const Datastore = require('nedb');
const db={
  user:new Datastore({filename:"./db/users.db",autoload:true}),
  message:new Datastore({filename:"./db/messages.db",autoload:true}),
  userInfo:new Datastore({filename:"./db/userInfo.db",autoload:true})
}
module.exports=db;
