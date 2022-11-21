const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const patientController = require('../controllers/patientController')

router
    .route('/')
    .get(patientController.getAllPatients)
    .post(patientController.createNewPatient)
    .patch(patientController.updatePatient)
    .delete(patientController.deletePatient)

module.exports = router
