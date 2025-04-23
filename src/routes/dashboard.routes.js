const express = require('express');
const router = express.Router();
const { verifyJwt } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

const { getDashboardData } = require('../controllers/dashboard.controller');


router.get('/', verifyJwt, isAdmin, getDashboardData);

module.exports = router;
