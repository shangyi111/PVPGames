const express = require('express');
const router = express.Router();
const con = require('./data').con;

const board = new Array(9).fill("").map(a=>"");
const players = {};
let playerA;
let playerB;
let row = [0,0,0];
let col = [0,0,0]
let dia = antiDia =0;
let isTurn;
let winner;
let isGame;


router.post('/player/add',(req,res,next)=>{
    if(Object.keys(players).length>=2){
        res.send('Queue full, please join later');
    }else{
        const username = req.body.name;
        
        const updatePlayersSql = `Insert into ttt_players (username, isTurn) values('${username}',0)`
        con.query(updatePlayersSql,(err,result)=>{
            if(err){
                res.send(err);
            }else{
                const selectUserSql = `SELECT * FROM ttt_players WHERE username = '${username}'`;
                con.query(selectUserSql,(err,result)=>{
                    if(err)res.send(err);
                    const resultKey = result[0].username;
                    const resultValue = {
                        username:resultKey,
                        id:result[0].id
                    };
                    players[resultKey]= resultValue; 
                    res.send(players);
                })   
            }
        })
    }
})
router.post('/player/delete',(req,res,next)=>{

    const username = req.body.name;
    const updatePlayersSql = `delete from ttt_players where username = '${username}'`
    con.query(updatePlayersSql,(err,result)=>{
        if(err || result.affectedRows===0) res.send({code:0,//failed
            result});
        else{
            delete players[username];
            res.send({
                code:1,//success
                players});
        }
    })
})
router.post('/player/updateSign',(req,res,next)=>{
    const username = req.body.username;
    let keys = Object.players.keys();
    let signTaken;
    let sign;
    for(let i = 0; i <keys.length; i ++){
        if(keys[i]!==username){
            if(players[keys[i]].sign===undefined){
                sign ="X";
            }else{
                signTaken = players[key[i]].sign;
                if(signTaken==="X") sign ="O";
                else if(signTaken==="O") sign="X";
            }
            players[username].sign = sign;
        }
    }
    res.send({players});
})
router.post('/player/move',(req,res,next)=>{
    const username = req.body.name;
    const index = req.body.index;
    if(isTurn.username===username){
        board[index]=players[username].sign;
        //check db winning or not
        if(isTurn.username === playerA.username){
            isTurn = playerB;
        }
        res.send({
            isTurn,
            players,
            board,
            isGame
        })
    }
})
router.post('/player/start',(req,res,next)=>{
    const username = req.body.name;   
    playerA = players[Object.keys(players)[0]];
    playerB = players[Object.keys(players)[1]];
    isTurn = playerA;
    isGame = true;
    res.send({board:new Array(9).fill("").map(a=>""),
              isGame,
              players,
              isTurn
            });
})
router.get('/player/board',(req,res,next)=>{
    res.send({board,
              players
    });
})




module.exports = router;