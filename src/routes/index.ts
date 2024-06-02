
import express from 'express';

const router = express.Router();
console.log('----------------------------------1------------------------------');
router.use('/', require('./authRoutes').default);
console.log('----------------------------------2------------------------------');
router.use('/user', require('./userRoutes').default);
console.log('----------------------------------3------------------------------');
router.use('/admin',require('./adminRoutes').default);
console.log('---------------------------------4-----------------------');
router.use('/member',require('./membershipRoutes').default);
export = router;
