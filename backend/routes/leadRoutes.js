const express = require('express');
const router = express.Router();
const { createLead, getLeads } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(createLead)
    .get(protect, authorize('admin'), getLeads);

module.exports = router;
