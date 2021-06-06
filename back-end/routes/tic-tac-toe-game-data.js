const express = require('express');
const router = express.Router();
const con = require('./data').con;


router.post('/:roomId/msgs-users/mysql',(req,res,next)=>{
    let roomId = req.params.roomId;
    let username = req.body.user;
    let msg = req.body.msg;
    let addOrDelete = req.body.addOrDelete;
    
    //update msgsByRoomId;
    let insertMsgByRoomIdSql = `INSERT INTO simpleangular.msgsByRoomId (roomId, msg,createdTime)
    VALUES ("${roomId}","${msg}",current_timestamp())`
    let showMsgsByRoomIdSql = `SELECT msg from simpleangular.msgsByRoomId  
                                WHERE roomId="${roomId}" 
                                ORDER BY createdTime DESC
                                LIMIT 0,10`;
    let msgsResult;

    con.promise().query(insertMsgByRoomIdSql).then(con.query(showMsgsByRoomIdSql,(err,res)=>{
        msgsResult=res;
     })
    )
    
   
    //update userByRoomId
    let showUsersByRoomIdSql = `SELECT username
                                   FROM simpleangular.usersByRoomId  
                                   WHERE roomId = "${roomId}"`;
    
    let insertOrDeleteSql;
    if(addOrDelete==="add"){
        insertOrDeleteSql = `INSERT INTO simpleangular.usersByRoomId (roomId, username,createdTime)
                             VALUES ("${roomId}","${username}",current_timestamp())`;
    }else if(addOrDelete==="delete"){
        insertOrDeleteSql = `DELETE FROM simpleangular.usersByRoomId 
                             WHERE username = "${username}";`
    }
    con.promise().query(insertOrDeleteSql).then(
        con.promise().query(showUsersByRoomIdSql).then(
            (showUsersResult)=>{
                console.log(`add or delete is ${addOrDelete}`,showUsersResult[0],msgsResult)
                res.send({
                    users:showUsersResult[0],
                    msgs:msgsResult
                })
            }
        )
    )
})
router.get('/rooms/mysql',(req,res,next)=>{
    let showUserByRoomIdSql = `SELECT roomId, 
                               COUNT(username) as UserCount from simpleangular.usersByRoomId  
                               GROUP BY roomId`;
       
    con.query(showUserByRoomIdSql,(err,result)=>{
        res.send(result) //database(key:roomId, value:users)
    }) 
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