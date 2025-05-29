// generateDocs.js
const fs = require('fs');
const swaggerSpec = require('./docs-config/swaggerConfig');

fs.writeFileSync('./openapi.json', JSON.stringify(swaggerSpec, null, 2));
console.log('✅ Swagger spec written to openapi.json');
