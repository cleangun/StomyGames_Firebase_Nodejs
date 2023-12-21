const express = require('express');
const router = express.Router();


// // 5분마다 업데이트(Coin추가)
// const job = schedule.scheduleJob('* */1 * * * *', () => {
// })
// job.cancel();

router.get("/", (req,res) => {
    res.send("index.jss");
})

module.exports = router;