// Mock database connection for development
const mockData = {
    classifications: [
        { classification_id: 1, classification_name: 'Custom' },
        { classification_id: 2, classification_name: 'Sedan' },
        { classification_id: 3, classification_name: 'SUV' },
        { classification_id: 4, classification_name: 'Truck' }
    ],
    vehicles: [
        {
            inv_id: 1,
            inv_make: 'DMC',
            inv_model: 'Delorean',
            inv_year: 1985,
            inv_description: 'The iconic time-traveling sports car from Back to the Future. Features gull-wing doors and stainless steel body.',
            inv_image: '/images/vehicles/no-image.png',
            inv_thumbnail: '/images/vehicles/no-image-tn.png',
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
            inv_description: 'Reliable and fuel-efficient compact sedan with modern features and comfortable interior.',
            inv_image: '/images/vehicles/no-image.png',
            inv_thumbnail: '/images/vehicles/no-image-tn.png',
            inv_price: 16999.00,
            inv_miles: 74750,
            inv_color: 'Blue',
            classification_id: 2,
            classification_name: 'Sedan'
        }
    ]
};

let nextClassificationId = 5;
let nextVehicleId = 3;

const pool = {
    execute: async (sql, params) => {
        // Mock database responses
        if (sql.includes('SELECT * FROM classification')) {
            return [mockData.classifications];
        } else if (sql.includes('inventory WHERE classification_id')) {
            const classificationId = params[0];
            const vehicles = mockData.vehicles.filter(v => v.classification_id == classificationId);
            return [vehicles];
        } else if (sql.includes('inventory WHERE inv_id')) {
            const invId = params[0];
            const vehicle = mockData.vehicles.find(v => v.inv_id == invId);
            return [[vehicle]];
        } else if (sql.includes('INSERT INTO classification')) {
            const classificationName = params[0];
            const newClassification = {
                classification_id: nextClassificationId++,
                classification_name: classificationName
            };
            mockData.classifications.push(newClassification);
            return [{ affectedRows: 1, insertId: newClassification.classification_id }];
        } else if (sql.includes('INSERT INTO inventory')) {
            const newVehicle = {
                inv_id: nextVehicleId++,
                inv_make: params[0],
                inv_model: params[1],
                inv_year: params[2],
                inv_description: params[3],
                inv_image: params[4],
                inv_thumbnail: params[5],
                inv_price: params[6],
                inv_miles: params[7],
                inv_color: params[8],
                classification_id: params[9]
            };
            mockData.vehicles.push(newVehicle);
            return [{ affectedRows: 1, insertId: newVehicle.inv_id }];
        }
        return [[]];
    }
};

module.exports = pool;
