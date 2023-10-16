const express = require('express')
const isValidId = require("../../middlewares/isValidId")
const router = express.Router() 
const cntrl = require("../../controllers/contacts")
const { validate } = require("../../validate/validate")
const schemas = require("../../schemas/contacts")

router.get('/', cntrl.getAll);

 router.get('/:id',isValidId, cntrl.getContactById)

 router.post('/',validate(schemas.addSchema), cntrl.addContact)

 router.delete('/:id',isValidId, cntrl.removeContact)

router.put('/:id', isValidId, validate(schemas.addSchema), cntrl.updateContact)
 
router.patch('/:id/favorite',isValidId,validate(schemas.updateFavoriteSchema), cntrl.updateFavorite)

module.exports = router
