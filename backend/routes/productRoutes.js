const express = require('express');
const { ObjectId } = require('mongodb');
const { getProductsCollection } = require('../db');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

const EXPIRING_SOON_DAYS = 30;

function computeExpiryDate(purchaseDate, warrantyDurationMonths) {
  const purchase = new Date(purchaseDate);
  if (Number.isNaN(purchase.getTime())) {
    throw new Error('Invalid purchase date');
  }

  const months = Number(warrantyDurationMonths);
  if (!Number.isFinite(months) || months <= 0) {
    throw new Error('Warranty duration must be a positive number');
  }

  const expiry = new Date(purchase);
  expiry.setMonth(expiry.getMonth() + months);
  return expiry;
}

function computeStatus(expiryDate) {
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (expiryDate < endOfToday) {
    return 'Expired';
  }

  const diffMs = expiryDate.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays <= EXPIRING_SOON_DAYS) {
    return 'Expiring Soon';
  }

  return 'Active';
}

// All product routes require authentication
router.use(authenticate);

// Create product (+ warranty details)
router.post('/', async (req, res) => {
  try {
    const {
      productName,
      brand,
      category,
      purchaseDate,
      warrantyDuration,
      warrantyType = 'Manufacturer',
      notes = '',
      serviceCenterName = '',
      serviceCenterPhone = '',
      serviceCenterAddress = '',
    } = req.body || {};

    if (!productName || !brand || !category || !purchaseDate || !warrantyDuration) {
      return res.status(400).json({ message: 'Missing required product or warranty fields.' });
    }

    const expiryDate = computeExpiryDate(purchaseDate, warrantyDuration);
    const status = computeStatus(expiryDate);

    const now = new Date();

    const products = await getProductsCollection();

    const doc = {
      userId: req.user.id,
      productName,
      brand,
      category,
      purchaseDate: new Date(purchaseDate),
      warrantyDuration: Number(warrantyDuration),
      warrantyType,
      expiryDate,
      status,
      notes,
      invoiceId: null,
      serviceCenterName,
      serviceCenterPhone,
      serviceCenterAddress,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    };

    const result = await products.insertOne(doc);
    const created = await products.findOne({ _id: result.insertedId });

    return res.status(201).json(created);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Failed to create product.' });
  }
});

// List products for current user
router.get('/', async (req, res) => {
  try {
    const { status, category, search } = req.query;

    const products = await getProductsCollection();

    const filter = {
      userId: req.user.id,
      isDeleted: { $ne: true },
    };

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ productName: regex }, { brand: regex }];
    }

    const docs = await products
      .find(filter)
      .sort({ expiryDate: 1 })
      .toArray();

    // Refresh status based on current date if necessary
    const now = new Date();
    const updates = [];

    for (const p of docs) {
      const newStatus = computeStatus(p.expiryDate);
      if (newStatus !== p.status) {
        updates.push(
          products.updateOne(
            { _id: p._id },
            { $set: { status: newStatus, updatedAt: now } }
          )
        );
        p.status = newStatus;
      }
    }

    if (updates.length) {
      await Promise.all(updates);
    }

    return res.json(docs);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product id.' });
    }

    const products = await getProductsCollection();
    const product = await products.findOne({
      _id: new ObjectId(id),
      userId: req.user.id,
      isDeleted: { $ne: true },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ message: 'Failed to fetch product.' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product id.' });
    }

    const {
      productName,
      brand,
      category,
      purchaseDate,
      warrantyDuration,
      warrantyType,
      notes,
      serviceCenterName,
      serviceCenterPhone,
      serviceCenterAddress,
    } = req.body || {};

    const products = await getProductsCollection();

    const existing = await products.findOne({
      _id: new ObjectId(id),
      userId: req.user.id,
      isDeleted: { $ne: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updateDoc = {};

    if (productName !== undefined) updateDoc.productName = productName;
    if (brand !== undefined) updateDoc.brand = brand;
    if (category !== undefined) updateDoc.category = category;
    if (warrantyType !== undefined) updateDoc.warrantyType = warrantyType;
    if (notes !== undefined) updateDoc.notes = notes;
    if (serviceCenterName !== undefined) updateDoc.serviceCenterName = serviceCenterName;
    if (serviceCenterPhone !== undefined) updateDoc.serviceCenterPhone = serviceCenterPhone;
    if (serviceCenterAddress !== undefined) updateDoc.serviceCenterAddress = serviceCenterAddress;

    let purchase = existing.purchaseDate;
    let duration = existing.warrantyDuration;

    if (purchaseDate !== undefined) {
      purchase = new Date(purchaseDate);
      updateDoc.purchaseDate = purchase;
    }

    if (warrantyDuration !== undefined) {
      duration = Number(warrantyDuration);
      updateDoc.warrantyDuration = duration;
    }

    if (purchaseDate !== undefined || warrantyDuration !== undefined) {
      const newExpiry = computeExpiryDate(purchase, duration);
      updateDoc.expiryDate = newExpiry;
      updateDoc.status = computeStatus(newExpiry);
    }

    updateDoc.updatedAt = new Date();

    await products.updateOne(
      { _id: existing._id },
      { $set: updateDoc }
    );

    const updated = await products.findOne({ _id: existing._id });

    return res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Failed to update product.' });
  }
});

// Delete product (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product id.' });
    }

    const products = await getProductsCollection();

    const existing = await products.findOne({
      _id: new ObjectId(id),
      userId: req.user.id,
      isDeleted: { $ne: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await products.updateOne(
      { _id: existing._id },
      { $set: { isDeleted: true, updatedAt: new Date() } }
    );

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Failed to delete product.' });
  }
});

module.exports = router;


