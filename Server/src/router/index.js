const Router = require('express').Router;
const b1SL = require('../controllers/b1SL');
const b1HANA = require('../controllers/b1HANA');
const authMiddleware = require('../middlewares/authMiddleware');
const router = new Router();


router.post('/api/login', b1HANA.login);
router.get('/api/invoices', authMiddleware, b1HANA.invoices);

// router.get('/b1s/v1/:path', b1SL.proxyFunc);
// router.post('/b1s/v1/:path', b1SL.proxyFunc);
// router.patch('/b1s/v1/:path', b1SL.proxyFunc);
// router.put('/b1s/v1/:path', b1SL.proxyFunc);
// router.delete('/b1s/v1/:path', b1SL.proxyFunc);
// router.get('/b1s/v1/:path/:path2', b1SL.proxyFunc);
// router.post('/b1s/v1/:path/:path2', b1SL.proxyFunc);
// router.patch('/b1s/v1/:path/:path2', b1SL.proxyFunc);
// router.put('/b1s/v1/:path/:path2', b1SL.proxyFunc);
// router.delete('/b1s/v1/:path/:path2', b1SL.proxyFunc);

module.exports = router
