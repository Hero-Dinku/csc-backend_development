const utilities = {};

// Hardcoded navigation data
utilities.getNav = async () => {
    return '<nav class=\"navbar\"><ul><li><a href=\"/\" title=\"Home\">Home</a></li><li><a href=\"/inv/classification/1\" title=\"Custom\">Custom</a></li><li><a href=\"/inv/classification/2\" title=\"Sedan\">Sedan</a></li><li><a href=\"/inv/classification/3\" title=\"SUV\">SUV</a></li><li><a href=\"/inv/classification/4\" title=\"Truck\">Truck</a></li></ul></nav>';
};

// Hardcoded vehicle data with real image URLs
const vehicleData = [
    {
        inv_id: 1,
        inv_make: 'DMC',
        inv_model: 'Delorean',
        inv_year: 1985,
        inv_description: 'The iconic time-traveling sports car from Back to the Future. Features gull-wing doors and stainless steel body. This classic sports car is powered by a PRV (Peugeot-Renault-Volvo) 2.85 L V6 engine and features those famous gull-wing doors that make it instantly recognizable.',
        inv_image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        inv_thumbnail: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        inv_price: 65000.00,
        inv_miles: 12500,
        inv_color: 'Silver',
        classification_id: 1,
        classification_name: 'Custom'
    },
    {
        inv_id: 2,
        inv_make: 'Nissan',
        inv_model: 'Sentra SV',
        inv_year: 2019,
        inv_description: 'Reliable and fuel-efficient compact sedan with modern features and comfortable interior. This well-maintained Sentra features Bluetooth connectivity, backup camera, and excellent fuel economy. Perfect for commuting and daily driving.',
        inv_image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        inv_thumbnail: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        inv_price: 16999.00,
        inv_miles: 74750,
        inv_color: 'Blue',
        classification_id: 2,
        classification_name: 'Sedan'
    },
    {
        inv_id: 3,
        inv_make: 'Jeep',
        inv_model: 'Grand Cherokee',
        inv_year: 2022,
        inv_description: 'Powerful SUV with off-road capabilities and luxurious interior features. This nearly new Grand Cherokee comes with 4WD, leather seats, premium sound system, and all the latest safety features. Ready for both city driving and outdoor adventures.',
        inv_image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        inv_thumbnail: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        inv_price: 42999.00,
        inv_miles: 15000,
        inv_color: 'Black',
        classification_id: 3,
        classification_name: 'SUV'
    },
    {
        inv_id: 4,
        inv_make: 'Ford',
        inv_model: 'F-150',
        inv_year: 2021,
        inv_description: 'Americas best-selling truck with powerful engine options and advanced towing capabilities. This F-150 features the EcoBoost V6 engine, crew cab configuration, tow package, and premium interior. Excellent condition with low miles.',
        inv_image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        inv_thumbnail: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        inv_price: 38999.00,
        inv_miles: 22000,
        inv_color: 'White',
        classification_id: 4,
        classification_name: 'Truck'
    }
];

// Build classification view HTML
utilities.buildClassificationGrid = async function(classificationId) {
    try {
        let grid = '<div class=\"classification-grid\">';
        const vehicles = vehicleData.filter(v => v.classification_id == classificationId);
        
        if (vehicles.length > 0) {
            vehicles.forEach(vehicle => {
                grid += '<div class=\"vehicle-card\">' +
                    '<a href=\"/inv/detail/' + vehicle.inv_id + '\">' +
                    '<img src=\"' + vehicle.inv_thumbnail + '\" alt=\"' + vehicle.inv_make + ' ' + vehicle.inv_model + '\" loading=\"lazy\">' +
                    '<div class=\"vehicle-info\">' +
                    '<h3>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h3>' +
                    '<p class=\"price\">' + utilities.formatPrice(vehicle.inv_price) + '</p>' +
                    '</div>' +
                    '</a>' +
                    '</div>';
            });
        } else {
            grid += '<p>No vehicles found in this classification.</p>';
        }
        
        grid += '</div>';
        return grid;
    } catch (error) {
        throw error;
    }
};

// Build vehicle detail HTML
utilities.buildVehicleDetail = async function(invId) {
    try {
        const vehicle = vehicleData.find(v => v.inv_id == invId);
        
        if (!vehicle) {
            return '<p>Vehicle not found.</p>';
        }

        const detailHTML = '<div class=\"vehicle-detail-container\">' +
            '<div class=\"vehicle-image\">' +
            '<img src=\"' + vehicle.inv_image + '\" alt=\"' + vehicle.inv_make + ' ' + vehicle.inv_model + '\" loading=\"lazy\">' +
            '</div>' +
            '<div class=\"vehicle-info\">' +
            '<h2>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>' +
            '<p class=\"price\">' + utilities.formatPrice(vehicle.inv_price) + '</p>' +
            '<p class=\"description\">' + vehicle.inv_description + '</p>' +
            
            '<div class=\"vehicle-specs\">' +
            '<div class=\"spec-row\">' +
            '<span class=\"spec-label\">Mileage:</span>' +
            '<span class=\"spec-value\">' + utilities.formatMileage(vehicle.inv_miles) + ' miles</span>' +
            '</div>' +
            '<div class=\"spec-row\">' +
            '<span class=\"spec-label\">Color:</span>' +
            '<span class=\"spec-value\">' + vehicle.inv_color + '</span>' +
            '</div>' +
            '<div class=\"spec-row\">' +
            '<span class=\"spec-label\">Year:</span>' +
            '<span class=\"spec-value\">' + vehicle.inv_year + '</span>' +
            '</div>' +
            '<div class=\"spec-row\">' +
            '<span class=\"spec-label\">Body Style:</span>' +
            '<span class=\"spec-value\">' + vehicle.classification_name + '</span>' +
            '</div>' +
            '</div>' +
            
            '<div class=\"action-buttons\">' +
            '<button class=\"btn-primary\">Start My Purchase</button>' +
            '<button class=\"btn-secondary\">Schedule Test Drive</button>' +
            '<button class=\"btn-secondary\">Apply for Financing</button>' +
            '</div>' +
            
            '<div class=\"contact-info\">' +
            '<h3>Contact Us</h3>' +
            '<p>Call Us: <strong>800-396-7886</strong></p>' +
            '<p>Visit Us: 123 Car Street, Auto City, ST 12345</p>' +
            '<p>Hours: Mon-Fri 9AM-7PM, Sat 10AM-5PM</p>' +
            '</div>' +
            '</div>' +
            '</div>';
        
        return detailHTML;
    } catch (error) {
        throw error;
    }
};

// Format price with USD symbol and commas
utilities.formatPrice = function(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Format mileage with commas
utilities.formatMileage = function(mileage) {
    return new Intl.NumberFormat('en-US').format(mileage);
};

module.exports = utilities;
