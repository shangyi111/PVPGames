const express = require('express');
const router = express.Router();
const con = require('./data').con;


router.get('',(req,res,next)=>{
    res.send(console.log(req))
})
router.post('',(req,res,next) =>{

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    let sql = `Select username FROM users WHERE username = '${username}' or email = '${email}' `;

    
    con.query(sql,(err,result)=>{
        if(err){
            res.status().send(err);
        }else if(!result.length){
            sql = `Insert into users (username, email,password) values('${username}','${email}','${password}')`
            let message="account created successfully";
            con.query(sql,(err,result)=>{
                res.send({
                    status:1,
                    message
                })
            })
        }else if(result.length){
            let message="user already existed";
            res.send({
                status:0,
                message
            })
        }
    })

})

module.exports = router;