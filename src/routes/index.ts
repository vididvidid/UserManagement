// const express = require('express');
// const router = express.Router();

// router.use('/',require('./authRoutes'));
// router.use('/user',require('./userRoutes'));

// module.exports = router;


import express from 'express';
const router = express.Router();
console.log('----------------------------------1------------------------------');
router.use('/', require('./authRoutes').default);
console.log('----------------------------------2------------------------------');
router.use('/user', require('./userRoutes').default);
console.log('----------------------------------3------------------------------');

// export default router;
export = router;
