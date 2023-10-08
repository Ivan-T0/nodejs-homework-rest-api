const express = require('express')

const router = express.Router() 
const cntrl = require("../../controllers/contacts")
const { validate } = require("../../validate/validate")
const schemas = require("../../schemas/contacts")

router.get('/', cntrl.getAll);

router.get('/:id', cntrl.getContactById)

router.post('/',validate(schemas.addSchema), cntrl.addContact)

router.delete('/:id', cntrl.removeContact)

router.put('/:id',validate(schemas.addSchema), cntrl.updateContact)

module.exports = router
