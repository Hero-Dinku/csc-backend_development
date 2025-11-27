// Server-side validation functions
const validation = {
  checkClassificationName: (name) => {
    const errors = [];
    if (!name || name.trim() === '') {
      errors.push('Classification name is required');
    }
    if (name && name.length < 2) {
      errors.push('Classification name must be at least 2 characters long');
    }
    if (name && !/^[A-Za-z0-9\s]+$/.test(name)) {
      errors.push('Classification name can only contain letters, numbers, and spaces');
    }
    return errors;
  },

  checkInventoryData: (data) => {
    const errors = [];

    // Required fields
    const required = ['inv_make', 'inv_model', 'inv_year', 'inv_price', 'classification_id'];
    required.forEach(field => {
      if (!data[field] || data[field].toString().trim() === '') {
        const fieldName = field.replace('inv_', '').toUpperCase();
        errors.push(fieldName + ' is required');
      }
    });

    // Year validation
    if (data.inv_year) {
      const year = parseInt(data.inv_year);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
        errors.push('Year must be a valid year between 1900 and current year + 1');
      }
    }

    // Price validation
    if (data.inv_price) {
      const price = parseFloat(data.inv_price);
      if (isNaN(price) || price <= 0) {
        errors.push('Price must be a positive number');
      }
    }

    // Miles validation
    if (data.inv_miles) {
      const miles = parseInt(data.inv_miles);
      if (isNaN(miles) || miles < 0) {
        errors.push('Miles must be a positive number');
      }
    }

    return errors;
  }
};

module.exports = validation;
