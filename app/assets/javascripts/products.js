var currentProduct = {};
var show = false;
var productID;

function showForm() {
  show = !show;
  $('#p-form').remove();
  $('#products-list').toggle();
  if (show) {
    $.ajax({
      url: '/product_form',
      method: 'GET',
      data: { id: productID }
    }).done( function(html) {
      $('#toggle').after(html)
    });
  }
}

function getID(id) {
  $.ajax({
    url: 'http://json-server.devpointlabs.com/api/v1/products/' + id,
    type: 'GET'
  }).done( function(product) {
    if (productID) {
      var li = $("[data-product-id='" + id + "'")
      $(li).replaceWith(product)
      productID = null;
    } else {
      $('#product-list').append(product);
    }
  });
}
 //HELPERS ABOVE THIS POINT

$(document).on('submit', '#p-form form', function(e) {
  e.preventDefault();
  var data = $(this).serializeArray();
  var url = 'http://json-server.devpointlabs.com/api/v1/products';
  var method = 'POST';
  if (productID) {
    url = url + '/' + productID;
    method = 'PUT'
  }
  $.ajax({
    url: url,
    type: method,
    dataType: 'JSON',
    data: data
  }).done( function(product) {
    showForm();
    getID(product.id);
  }).fail( function(err) {
    alert('error')
  });
});

$(document).ready( function() {
  $(document).on('click', '#delete-product', function() {
    var id = $(this).siblings('.product').data().id
    $.ajax({
      url: 'http://json-server.devpointlabs.com/api/v1/products/' + id,
      type: 'DELETE'
    }).done( function() {
      var row = $("[data-id='" + id + "'")
      row.parent().remove('li')
    });
  });
});


$(document).on('click', '#edit-product', function() {
  productID = $(this).siblings('.product').data().id
  showForm();
});

$(document).ready( function() {
  $('#toggle').on('click', function() {
    showForm()
  });
});


$(document).ready( function() {
  $.ajax({
    method: "GET",
    url: 'http://json-server.devpointlabs.com/api/v1/products'
  }).done( function(products) {
    var list = $('#product-list');
    products.forEach( function(prod) {
      var li = '<li data-product-id="' + prod.id + '">' + prod.name + '-' + prod.description +
      '<div class="product" data-id="'+ prod.id +' " data-name="'+ prod.name +'">' + '</div>' +
      '<button class="btn" id="edit-product">Edit</button>' +
      '<button class="btn" id="delete-product">Delete</button>'+
      '</li>' ;

      list.append(li);
    });
  });
});
