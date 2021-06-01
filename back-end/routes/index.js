const express = require('express');
const router = express.Router();
const userData = require('./data').router;
const signup = require('./signup');
const signin = require('./signin');
const ttt = require('./tic-tac-toe-game-data');

router.use('/user-data',userData);
router.use('/user/register',signup); 
router.use('/user/signin',signin);
router.use('/user/tic-tac-toe',ttt);
module.exports = router;