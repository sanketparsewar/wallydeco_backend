const express = require('express')
const { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon, applyCoupon } = require('../controllers/coupon.controller')
const router = express.Router();

router.post('/', createCoupon)
router.post("/apply", applyCoupon);
router.get('/', getCoupons)
router.get('/:id', getCouponById)
router.put('/:id', updateCoupon)
router.delete('/:id', deleteCoupon)

module.exports = router;