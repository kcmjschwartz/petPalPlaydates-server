const Express = require ('express');
const router = Express.Router();

router.get('/practice', (req, res) => {
    res.send('Practice Endpoint Works')
})
module.exports = router;