const Product = {}

exports.createProduct = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newProduct = new Product({});
        await newProduct.save(); // Guardar el producto en la base de datos
        res.status(201).json(newProduct)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Obtener todos los productos de la base de datos
        res.status(200).json(products); // Responder con la lista de productos
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Método para actualizar un producto por ID
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, description } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, price, description },
            { new: true } // Devolver el producto actualizado
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(updatedProduct); // Responder con el producto actualizado
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId); // Eliminar el producto por ID
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
