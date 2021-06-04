const express = require('express');
const router = express.Router();
const con = require('./data').con;

let msgs = {};
let users = {};

router.get('/rooms',(req,res,next)=>{
    res.send(users) //database(key:roomId, value:users)
})
router.post('/:roomId/msgs-users',(req,res,next)=>{
    let roomId = req.params.roomId;
    let user = req.body.user;
    let msg = req.body.msg;
    let addOrDelete = req.body.addOrDelete;
    //update msgs database
    if(msgs[roomId]===undefined){
        msgs[roomId] = [msg]
    }else{
        msgs[roomId].unshift(msg);
    }
    if(msgs[roomId].length>10){
        msgs[roomId] = msgs[roomId].slice(0,10)
    }
    //update user database
    if(addOrDelete==="add"){
        if(users[roomId]===undefined){
            users[roomId] = [user]
        }else{
            let list = users[roomId];
            if(!list.includes(user)){
                users[roomId].unshift(user);
            }
        }
        //console.log(users,"add after")
        res.send({
            users,
            msgs:msgs[roomId]
        });
    }else if(addOrDelete==="delete"){
        if(users[roomId]!==undefined){
            //console.log(users,"delete before")
            let temp = users[roomId].filter((element)=>{
                return element!==user
            })
            users[roomId]=temp;
            //console.log("in case of empty rooms",users[roomId])
            if(users[roomId].length===0){
                delete users[roomId];
                res.send({
                    users,
                    msgs:msgs[roomId],
                });
            }else{
                //console.log(users,"delete after")
                res.send({
                    users,
                    msgs:msgs[roomId],
                });
            }
            
        }
    }
})

// router.post('/player/add',(req,res,next)=>{
//     if(Object.keys(players).length>=2){
//         res.send('Queue full, please join later');
//     }else{
//         const username = req.body.name;
        
//         const updatePlayersSql = `Insert into ttt_players (username, isTurn) values('${username}',0)`
//         con.query(updatePlayersSql,(err,result)=>{
//             if(err){
//                 res.send(err);
//             }else{
//                 const selectUserSql = `SELECT * FROM ttt_players WHERE username = '${username}'`;
//                 con.query(selectUserSql,(err,result)=>{
//                     if(err)res.send(err);
//                     const resultKey = result[0].username;
//                     const resultValue = {
//                         username:resultKey,
//                         id:result[0].id
//                     };
//                     players[resultKey]= resultValue; 
//                     res.send(players);
//                 })   
//             }
//         })
//     }
// })
// router.post('/player/delete',(req,res,next)=>{

//     const username = req.body.name;
//     const updatePlayersSql = `delete from ttt_players where username = '${username}'`
//     con.query(updatePlayersSql,(err,result)=>{
//         if(err || result.affectedRows===0) res.send({code:0,//failed
//             result});
//         else{
//             delete players[username];
//             res.send({
//                 code:1,//success
//                 players});
//         }
//     })
// })






module.exports = router;