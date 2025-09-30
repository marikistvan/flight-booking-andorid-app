const express = require('express')
const router =express.Router()
const { test } =require("../controllers/notificationController")

router.post('/',test);

module.exports =router;