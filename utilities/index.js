const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ************************
 * Build Classification List for Dropdown
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      grid +=  '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
      grid +=  ' details"><img src="' + vehicle.inv_thumbnail 
      grid +=  '" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      grid +=  ' on CSE Motors" /></a>'
      grid +=  '<div class="namePrice">'
      grid +=  '<hr />'
      grid +=  '<h2>'
      grid +=  '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      grid +=  vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      grid +=  vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid +=  '</h2>'
      grid +=  '<span>$' 
      grid +=  new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid +=  '</div>'
      grid +=  '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildVehicleDetail = async function(data){
  let detail
  if(data.length > 0){
    const vehicle = data[0]
    detail = '<section class="vehicle-detail">'
    detail += '<div class="vehicle-image">'
    detail += '<img src="' + vehicle.inv_image + '" alt="Image of ' 
    detail += vehicle.inv_make + ' ' + vehicle.inv_model + '">'
    detail += '</div>'
    detail += '<div class="vehicle-info">'
    detail += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
    detail += '<p class="price">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
    detail += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
    detail += '<p><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
    detail += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
    detail += '<p class="description">' + vehicle.inv_description + '</p>'
    detail += '</div>'
    detail += '</section>'
  } else {
    detail = '<p class="notice">Sorry, vehicle details could not be found.</p>'
  }
  return detail
}

module.exports = Util;
