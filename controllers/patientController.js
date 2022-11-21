const Patient = require('../models/Patient')
const asyncHandler = require('express-async-handler')


// @route GET /patients
const getAllPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find().lean()
    if(!patients?.length) {
        return res.status(400).json({
            message: 'No patient data is found here'
        })
    }
    res.json(patients)
})


// @route POST/patients
const createNewPatient = asyncHandler(async (req, res) => {
    const { pID, patientName, address, mobileNumber, deceaseRecordOne, medicineRecordOne, deceaseRecordTwo, medicineRecordTwo, doctorID } = req.body

    // confirm data
    if(!pID || !patientName || !address || !mobileNumber || !deceaseRecordOne || !medicineRecordOne || !doctorID ) {
        return res.status(400).json({
            message: 'All fields are required'
        })
    }

    // check for duplicates
    const duplicate = await Patient.findOne({pID}).lean().exec()
    if(duplicate) {
        return res.status(400).json({
            message: 'Duplicate ID'
        })
    }

    const patientObject = { pID, patientName, address, mobileNumber, deceaseRecordOne, medicineRecordOne, deceaseRecordTwo, medicineRecordTwo, doctorID }

    // Create and store new patient
    const patient = await Patient.create(patientObject)

    if(patient) {
        res.status(201).json({
            message: `New user ${patientName} with token ${patient.pToken} created`
        })
    }
    else {
        res.status(400).json({
            message: `Invalid patient data received`
        })
    }

})


// @route PATCH/patients
const updatePatient = asyncHandler(async (req, res) => {
    const { id, pToken, patientName, address, mobileNumber, deceaseRecordOne, medicineRecordOne, deceaseRecordTwo, medicineRecordTwo, doctorID } = req.body

    // Confirm data
    if(!pToken || !patientName || !address || !mobileNumber || !deceaseRecordOne || !medicineRecordOne || !doctorID) {
        return res.status(400).json({
            message: 'All fields are required'
        })
    }

    // check if the id exists
    // const patient = await Patient.findById(id).exec()
    const patient = await Patient.findOne({ pToken }).exec()

    if(!patient) {
        return res.status(400).json({ message: 'Patient not found' })
    }

    // check for duplicate
    const duplicate = await Patient.findOne({ pToken }).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({
            message: 'Duplicate ID'
        })
    }
    
    // Allow updates
    patient.patientName = patientName
    patient.address = address
    patient.mobileNumber = mobileNumber
    patient.deceaseRecordOne = deceaseRecordOne
    patient.medicineRecordOne = medicineRecordOne
    patient.deceaseRecordTwo = deceaseRecordTwo
    patient.medicineRecordTwo = medicineRecordTwo
    patient.doctorID = doctorID

    await patient.save()

    // send response
    res.json({
        message: `${patient.patientName} with token ${patient.pToken} updated`
    })
})


// @route DELETE/patients
const deletePatient = asyncHandler(async (req, res) => {
    const { pToken } = req.body

    // Confirm data
    if(!pToken) {
        return res.status(400).json({
            message: 'Token number required'
        })
    }   

    // Check if the user exist to delete
    const patient = await Patient.findOne({pToken}).exec()

    if(!patient) {
        return res.status(400).json({
            message: 'Patient not found'
        })
    }

    const result = await patient.deleteOne()

    const reply = `Username ${result.patientName} with token ${patient.pToken} deleted`

    res.json(reply)
})


module.exports = {
    getAllPatients,
    createNewPatient,
    updatePatient,
    deletePatient
}



