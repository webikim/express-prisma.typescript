import express from 'express'

const router = express.Router();

/* GET example page without jade. */
router.get('/', function (req, res, next) {
    res.sendFile(__dirname + "/views/index.html");
});

module.exports = router;
