const express = require('express');
const router = express.router()

router.get('/', (req, res) => {
    res.render('index' , {title: 'My Express App', message: 'Welcome to my Express App'});
});

module.exports = router;