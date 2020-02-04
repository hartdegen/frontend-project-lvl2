const yaml = require('js-yaml');
const fs = require('fs');

// Get document, or throw exception on error
try {
  const doc = yaml.safeLoad(fs.readFileSync('../__tests__/fixtures/after.yaml'));
  console.log(doc);
} catch (e) {
  console.log(e);
}