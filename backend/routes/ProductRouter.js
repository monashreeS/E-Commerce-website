const ensureAuthenticated = require('../middleware/Auth');
const router = require('express').Router();

// Temporary mock data (will be replaced with database queries)
const mockProducts = [
    {
        _id: '1',
        name: "Mobile",
        price: 10000,
        description: "Latest smartphone with advanced features",
        category: "Electronics"
    },
    {
        _id: '2',
        name: "TV",
        price: 20000,
        description: "55-inch 4K Smart TV",
        category: "Electronics"
    },
    {
        _id: '3',
        name: "Laptop",
        price: 50000,
        description: "High-performance laptop for professionals",
        category: "Computers"
    },
    {
        _id: '4',
        name: "Headphones",
        price: 3000,
        description: "Wireless noise-cancelling headphones",
        category: "Audio"
    }
];

// GET all products
router.get('/', ensureAuthenticated, (req, res) => {
    try {
        console.log('---- logged in user detail ---', req.user);
        
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: mockProducts
        });
        
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// GET product by ID
router.get('/:id', ensureAuthenticated, (req, res) => {
    try {
        const { id } = req.params;
        const product = mockProducts.find(p => p._id === id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
        
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = router;