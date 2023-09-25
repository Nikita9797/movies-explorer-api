const router = require('express').Router();
const { userPatchValidation } = require('../utils/validation');
const {
  getCurrentUserInfo,
  updateUser,
} = require('../controllers/users');

router.get('/me', getCurrentUserInfo);
router.patch('/me', userPatchValidation, updateUser);

module.exports = router;
