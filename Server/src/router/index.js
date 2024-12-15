const Router = require('express').Router;
const b1SL = require('../controllers/b1SL');
const b1HANA = require('../controllers/b1HANA');
const authMiddleware = require('../middlewares/authMiddleware');
const router = new Router();


router.post('/api/login', b1HANA.login);

router.get('/api/items', authMiddleware, b1HANA.items);
router.get('/api/invoices', authMiddleware, b1HANA.invoices);
router.get('/api/group', authMiddleware, b1HANA.groups);
router.get('/api/business-partner', authMiddleware, b1HANA.businessPartners);
router.get('/api/cars', authMiddleware, b1HANA.getCars);

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
