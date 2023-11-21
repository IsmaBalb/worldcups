const express = require('express');
const router = express.Router();
const {listworldcups, listworldcupsByID, addworldcups, updateWorldcups, deleteWorldcups, signInUser} = require('../controllers/world');


router.get('/', listworldcups); // http://localhost:3000/api/v1/world
router.get('/:id', listworldcupsByID); 
router.post('/', signInUser); 
router.put('/', addworldcups); 
router.patch('/:id', updateWorldcups);
router.delete('/:id', deleteWorldcups);

module.exports = router;