const createDOMPurify = require('dompurify');
const express = require('express');
const Inventory = require('../../../models/inventory/memory.js');
const { JSDOM } = require('jsdom');
const mongoose = require('mongoose');
//const sequence = require('../../../helpers/sequence');

const router = express.Router();

// configure mongoose promises
mongoose.Promise = global.Promise;

// POST to /populate
router.post('/populate', async (req, res) => {
  const query = Inventory.find().sort({ createdAt: -1 });
  const inventory = await query.exec();
  if (!inventory) {
    return res.send(JSON.stringify({ error: 'Internal System Error, please try again (2111)' }));
  }
  return res.json(inventory);
});

// POST to /upsert
router.post('/upsert', async (req, res) => {
  // Make sure a user has logged in
  if (!req.user) {
    return res.json({ error: 'User not logged in.' });
  }

  // sanitize body
  const { window } = (new JSDOM(''));
  const DOMPurify = createDOMPurify(window);
  const sanitizedBody = {
    part: DOMPurify.sanitize(req.body.part),
    qty: req.body.qty,
    ask: req.body.ask,
    comment: DOMPurify.sanitize(req.body.comment),
  };

  // if body.id exist, then it is an update, otherwise it is a NEW inventory add
  let item = {};
  if (req.body.id) {
    const query = Inventory.findOne({ _id: req.body.id });
    item = await query.exec();

    // if item not belong to the owner, return error
    if (item.owner !== req.user) {
      return res.json({ error: 'Internal Error: Ownership violation  (2211)' });
    }
    // NOT allow to change PartNumber while updating
    if (item.part !== sanitizedBody.part) {
      return res.json({ error: 'Internal Error: Changing part number is not allowed (2212)' });
    }
    item.qty = sanitizedBody.qty;
    item.comment = sanitizedBody.comment;
  } else {
    item = new Inventory(sanitizedBody);
  }

  // save new (or updated) item to database
  item.save((error) => {
    if (error) {
      return res.json({ error: 'Internal Error: fail to update database (2213)' });
    }
    return res.json({ success: true });
  });

  return null; // just to make eslint happy
});

module.exports = router;
