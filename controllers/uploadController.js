const xlsx = require('xlsx');

// Lógica de procesamiento para Productos
exports.handleUploadProductos = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }
    processExcelFile(req.file.path, (data) => {
        // Lógica específica para Productos
        data.forEach((row) => {
            console.log("Productos: ", row);
        });
        res.send(`Archivo ${req.file.filename} de Productos subido y procesado exitosamente.`);
    });
};

// Lógica de procesamiento para Proveedores
exports.handleUploadProveedores = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }
    processExcelFile(req.file.path, (data) => {
        // Lógica específica para Proveedores
        data.forEach((row) => {
            console.log("Proveedores: ", row);
        });
        res.send(`Archivo ${req.file.filename} de Proveedores subido y procesado exitosamente.`);
    });
};

// Lógica de procesamiento para Integrantes
exports.handleUploadIntegrantes = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }
    processExcelFile(req.file.path, (data) => {
        // Lógica específica para Integrantes
        data.forEach((row) => {
            console.log("Integrantes: ", row);
        });
        res.send(`Archivo ${req.file.filename} de Integrantes subido y procesado exitosamente.`);
    });
};

// Función para procesar archivos Excel
function processExcelFile(filePath, callback) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    callback(jsonData);
}
