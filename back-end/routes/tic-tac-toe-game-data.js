const express = require('express');
const router = express.Router();
const con = require('./data').con;

let msgsResult;
let showUsersResult;
const updateMsg= async (roomId,msg)=>{
    let insertMsgByRoomIdSql = `INSERT INTO simpleangular.msgsByRoomId (roomId, msg,createdTime)
                                VALUES ("${roomId}","${msg}",current_timestamp())`
    let showMsgsByRoomIdSql = `SELECT msg from simpleangular.msgsByRoomId  
                                WHERE roomId="${roomId}" 
                                ORDER BY createdTime DESC
                                LIMIT 0,10`;
    await con.promise().query(insertMsgByRoomIdSql);
    return await con.promise().query(showMsgsByRoomIdSql); 
}
const updateUser=async (roomId,username,addOrDelete)=>{
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
    await con.promise().query(`${insertOrDeleteSql}`);
    return await con.promise().query(`${showUsersByRoomIdSql}`);
    
}
router.post('/:roomId/msgs-users/mysql', async (req,res,next)=>{
    let roomId = req.params.roomId;
    let username = req.body.user;
    let msg = req.body.msg;
    let addOrDelete = req.body.addOrDelete;
    
    msgsResult = await updateMsg(roomId,msg);
    showUsersResult = await updateUser(roomId,username,addOrDelete);
    res.send({
        users:showUsersResult[0],
        msgs:msgsResult[0] 
    })
})
router.get('/rooms/mysql',(req,res,next)=>{
    let showUserByRoomIdSql = `SELECT roomId, 
                               COUNT(username) as UserCount from simpleangular.usersByRoomId  
                               GROUP BY roomId`;
       
    con.query(showUserByRoomIdSql,(err,result)=>{
        res.send(result)
    }) 
})




module.exports = router;