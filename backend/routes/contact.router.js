const express = require("express");
const router = express.Router();
const submitForm = require("../controllers/submit-form.controller");

router.post("/submit", submitForm);

module.exports = router;
