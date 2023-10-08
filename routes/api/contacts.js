const express = require('express')

const router = express.Router() 
const cntrl = require("../../controllers/contacts")

router.get('/', cntrl.getAll);

router.get('/:id', cntrl.getContactById)

router.post('/', cntrl.addContact)

router.delete('/:id', cntrl.removeContact)

router.put('/:id', cntrl.updateContact)

module.exports = router
