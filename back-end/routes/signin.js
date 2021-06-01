const express = require('express');
const router = express.Router();
const con = require('./data').con;
const jwt = require('jsonwebtoken');

const getPayload = (id,token,username,email) => {
    return {status:0,
    message:"Successfully logged in.",
    id,
    token,
    username,
    email
    };
};


router.get('',(req,res,next)=>{
    res.send(console.log(req))
})
  

router.post('',(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;
    const sql = `SELECT * FROM users WHERE username = '${username}' and password = '${password}'`;
    const postMethod = (err,result)=>{ 
        if(err){
            res.err;
        }else if(result.length!==0){
            const email = result[0].email;
            const username = result[0].username;
            const token = jwt.sign({result},"secret",{expiresIn:'1h'})
            res.send(getPayload(result[0].id,token,username,email));
        }else{
            res.send({
                status:1,   
                message:"Log in failed"
            })
        }
    };
    con.query(sql, postMethod);
})



module.exports = router;