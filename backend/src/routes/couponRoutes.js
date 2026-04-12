import express from 'express';
import Coupon from '../models/Coupon.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Mã không tồn tại' });
    }

    if (new Date() > new Date(coupon.endDate) || new Date() < new Date(coupon.startDate)) {
      return res.status(400).json({ message: 'Mã đã hết hạn hoặc chưa có hiệu lực' });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
