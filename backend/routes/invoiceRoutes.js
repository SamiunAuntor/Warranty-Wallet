const express = require('express');
const { ObjectId } = require('mongodb');
const { getProductsCollection, getInvoicesCollection } = require('../db');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// All invoice routes require authentication
router.use(authenticate);

// Upsert invoice for a product
router.post('/', async (req, res) => {
  try {
    const {
      productId,
      fileName,
      fileType,
      mimeType,
      fileSize,
      storageUrl,
      storageProvider = 'imgbb',
    } = req.body || {};

    if (!productId || !fileName || !fileType || !mimeType || !fileSize || !storageUrl) {
      return res.status(400).json({ message: 'Missing required fields for invoice.' });
    }

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product id.' });
    }

    const products = await getProductsCollection();
    const invoices = await getInvoicesCollection();

    const productObjectId = new ObjectId(productId);

    const product = await products.findOne({
      _id: productObjectId,
      userId: req.user.id,
      isDeleted: { $ne: true },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found for this user.' });
    }

    const now = new Date();

    // Upsert invoice document for this product & user
    await invoices.updateOne(
      { productId: productObjectId, userId: req.user.id },
      {
        $set: {
          userId: req.user.id,
          productId: productObjectId,
          fileName,
          fileType,
          mimeType,
          fileSize,
          storageUrl,
          storageProvider,
          uploadedAt: now,
          isDeleted: false,
        },
      },
      { upsert: true }
    );

    const invoice = await invoices.findOne({
      productId: productObjectId,
      userId: req.user.id,
      isDeleted: { $ne: true },
    });

    if (!invoice) {
      console.error('Invoice not found after upsert for product', productId);
      return res.status(500).json({ message: 'Failed to create/update invoice.' });
    }

    await products.updateOne(
      { _id: productObjectId },
      { $set: { invoiceId: invoice._id, updatedAt: now } }
    );

    return res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating/updating invoice:', error);
    return res.status(500).json({ message: 'Failed to create/update invoice.' });
  }
});

// Get invoice by product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product id.' });
    }

    const invoices = await getInvoicesCollection();

    const invoice = await invoices.findOne({
      productId: new ObjectId(productId),
      userId: req.user.id,
      isDeleted: { $ne: true },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found for this product.' });
    }

    return res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice by product:', error);
    return res.status(500).json({ message: 'Failed to fetch invoice.' });
  }
});

// Delete invoice (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid invoice id.' });
    }

    const invoices = await getInvoicesCollection();
    const products = await getProductsCollection();

    const invoice = await invoices.findOne({
      _id: new ObjectId(id),
      userId: req.user.id,
      isDeleted: { $ne: true },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    await invoices.updateOne(
      { _id: invoice._id },
      { $set: { isDeleted: true } }
    );

    await products.updateOne(
      { _id: invoice.productId, userId: req.user.id },
      { $set: { invoiceId: null, updatedAt: new Date() } }
    );

    return res.json({ message: 'Invoice deleted successfully.' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return res.status(500).json({ message: 'Failed to delete invoice.' });
  }
});

module.exports = router;
