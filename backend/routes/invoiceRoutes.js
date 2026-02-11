const express = require('express');
const { ObjectId } = require('mongodb');
const { getProductsCollection, getInvoicesCollection } = require('../db');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// All invoice routes require authentication
router.use(authenticate);

// Upsert invoice for a product (supports multiple images)
router.post('/', async (req, res) => {
  try {
    const {
      productId,
      images, // Array of image objects
    } = req.body || {};

    if (!productId || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: productId and images array.' });
    }

    if (images.length > 4) {
      return res.status(400).json({ message: 'Maximum 4 invoice images allowed per product.' });
    }

    // Validate each image object
    for (const img of images) {
      if (!img.fileName || !img.fileType || !img.mimeType || !img.fileSize || !img.storageUrl) {
        return res.status(400).json({ message: 'Each image must have fileName, fileType, mimeType, fileSize, and storageUrl.' });
      }
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

    // Prepare image objects with timestamps
    const imageObjects = images.map(img => ({
      fileName: img.fileName,
      fileType: img.fileType,
      mimeType: img.mimeType,
      fileSize: img.fileSize,
      storageUrl: img.storageUrl,
      storageProvider: img.storageProvider || 'imgbb',
      uploadedAt: img.uploadedAt || now,
    }));

    // Check if invoice already exists
    const existingInvoice = await invoices.findOne({
      productId: productObjectId,
      userId: req.user.id,
      isDeleted: { $ne: true },
    });

    let invoice;

    if (existingInvoice) {
      // Update existing invoice - replace all images
      await invoices.updateOne(
        { _id: existingInvoice._id },
        {
          $set: {
            images: imageObjects,
            updatedAt: now,
            isDeleted: false,
          },
        }
      );
      invoice = await invoices.findOne({ _id: existingInvoice._id });
    } else {
      // Create new invoice
      const result = await invoices.insertOne({
        userId: req.user.id,
        productId: productObjectId,
        images: imageObjects,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
      });
      invoice = await invoices.findOne({ _id: result.insertedId });
    }

    if (!invoice) {
      console.error('Invoice not found after upsert for product', productId);
      return res.status(500).json({ message: 'Failed to create/update invoice.' });
    }

    // Update product with invoice reference
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

// Get invoice by product (returns invoice with images array)
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
