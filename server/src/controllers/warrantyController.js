import Warranty from "../models/Warranty.js";

// @desc    Create new warranty
// @route   POST /api/warranties
// @access  Private
export const createWarranty = async (req, res) => {
    try {
        const {
            productName,
            brand,
            category,
            purchaseDate,
            warrantyDurationMonths,
            notes
        } = req.body;

        const expiryDate = new Date(purchaseDate);
        expiryDate.setMonth(
            expiryDate.getMonth() + Number(warrantyDurationMonths)
        );

        const warranty = await Warranty.create({
            user: req.user._id,
            productName,
            brand,
            category,
            purchaseDate,
            warrantyDurationMonths,
            expiryDate,
            notes
        });

        res.status(201).json({
            success: true,
            data: warranty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create warranty"
        });
    }
};

// @desc    Get all warranties of logged-in user
// @route   GET /api/warranties
// @access  Private
export const getMyWarranties = async (req, res) => {
    try {
        const warranties = await Warranty.find({ user: req.user._id })
            .sort({ expiryDate: 1 });

        res.json({
            success: true,
            count: warranties.length,
            data: warranties
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch warranties"
        });
    }
};

// @desc    Get single warranty
// @route   GET /api/warranties/:id
// @access  Private
export const getWarrantyById = async (req, res) => {
    try {
        const warranty = await Warranty.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: "Warranty not found"
            });
        }

        res.json({
            success: true,
            data: warranty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch warranty"
        });
    }
};

// @desc    Update warranty
// @route   PUT /api/warranties/:id
// @access  Private
export const updateWarranty = async (req, res) => {
    try {
        const warranty = await Warranty.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: "Warranty not found"
            });
        }

        const updates = req.body;

        // Recalculate expiry if needed
        if (updates.purchaseDate || updates.warrantyDurationMonths) {
            const purchaseDate =
                updates.purchaseDate || warranty.purchaseDate;

            const duration =
                updates.warrantyDurationMonths ||
                warranty.warrantyDurationMonths;

            const newExpiry = new Date(purchaseDate);
            newExpiry.setMonth(newExpiry.getMonth() + Number(duration));

            updates.expiryDate = newExpiry;
        }

        const updatedWarranty = await Warranty.findByIdAndUpdate(
            warranty._id,
            updates,
            { new: true }
        );

        res.json({
            success: true,
            data: updatedWarranty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update warranty"
        });
    }
};

// @desc    Delete warranty
// @route   DELETE /api/warranties/:id
// @access  Private
export const deleteWarranty = async (req, res) => {
    try {
        const warranty = await Warranty.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: "Warranty not found"
            });
        }

        await warranty.deleteOne();

        res.json({
            success: true,
            message: "Warranty deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete warranty"
        });
    }
};

// @desc    Upload invoice for a warranty
// @route   POST /api/warranties/:id/invoice
// @access  Private
export const uploadInvoice = async (req, res) => {
    try {
        const warranty = await Warranty.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: "Warranty not found"
            });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "Invoice file is required"
            });
        }

        warranty.invoiceUrl = req.file.path;
        await warranty.save();

        res.json({
            success: true,
            message: "Invoice uploaded successfully",
            invoiceUrl: warranty.invoiceUrl
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to upload invoice"
        });
    }
};
