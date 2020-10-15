//================
// load data ...
//================
$(document).ready(function ($) {
    $.getJSON("../js/foodList.json")
        //load data success
        .done(function (result) {
            database = result;
            let s = [];
            var params = {};
            let items = [];
            // get filter key
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
                params[key] = value;
            });
            var size = Object.entries(params).length; //lengh of filter 
            items = database;
            //filter category
            if (size == 1) {
                cat = params["cat"];
                items = items.filter(ele => ele.cat == cat);
                $('#' + cat).prop('checked', true);
            }
            //filter price, name
            if (size > 1) {
                var from, to, nameSearch, cate;
                for (var [key, value] of Object.entries(params)) {
                    // filter price from
                    if (key == 'price-filter-from') {
                        from = value == "" ? 0 : parseInt(value);
                    }
                    // filter price to
                    else if (key == 'price-filter-to') {
                        to = value == "" ? 1000 : parseInt(value);
                    }
                    //filter name
                    else if (key == 'search') {
                        nameSearch = value.trim().replaceAll('+', ' ');
                        var r = new RegExp(nameSearch, "i");
                    }
                    else if (key == 'cat') {
                        cate = value;
                        $('#' + cate).prop('checked', true);
                    }
                }
                items = items.filter(ele => ((ele.name.search(r) >= 0) && (ele.price >= from && ele.price <= to) &&  ele.cat.search(cate) >= 0));
            }
            // filter category
            $('.filterCatItem').click(function (e) {
                if (!$(this).is(':checked')) {
                    let param = getUpdatedParam("cat", $(this).val(), "hide")
                    window.location.href = 'products.html?' + param ;//unchecked
                } else {
                    let param = getUpdatedParam("cat", $(this).val())
                    window.location.href = 'products.html?' + param; //checked
                }
            })
            // up items on screen
            $.each(items, function (i, row) {
                s.push("<div class='col-sm-12 col-sm-6 col-md-4 item'>");
                s.push(`<a href='#'><img src='images/${row.image}' class='data-product' data-id='${row.id}'/> </a>`);
                s.push("<br> <b>$" + row.price + " </b> <br>");
                s.push("<input type='button' value='Add To Cart' onclick='addCart(" + row.id + ")' class='btn btn-success'> <br><br>");
                s.push("<b>" + row.name.toUpperCase().substring(0, 110) + "</b>");
                s.push("<br>" + row.description.replaceAll('<br>', ' ').substring(0, 59) + "...");
                s.push("<br>");
                s.push("</div>");
            });
            s.push("</div> </div>");
            $("#items-show").html(s.join(" "));

            // modal for items
            $(document).on('click', '.data-product', function () {
                let id = $(this).data('id')
                let product = database.filter(e => e.id == id)

                addModal(product[0])
                $('#modal-id').modal('show')
            })
        })
        //load data fail
        .fail(function () {
            alert("Fail to load data!");
        });
});
// function modal for items

function addModal(data) {
    let x = ` <div class="row">
                    <div class='col-xs-12 col-md-6'> <img src='images/${data.image}' alt=''> </div>
                        <div class='col-md-6'>
                            <h3>${data.name}</h3>
                            <p>Description: ${data.description}</p>
                            <h4>Price: $${data.price}</h4>
                        </div>
                    </div>

                        <div class="modal-footer" >
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick='addCart("${data.id}")'>Add to Cart</button>
                        </div>
                    </div>`
    $('.modal-body').html(x)
}
//get filter category key
function getUpdatedParam($param, $value, $type = 'add') {
    var params = {};
    
    window.location.search
        .replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
            params[key] = value;
        });
    switch ($type) {
        case 'add':
            params[$param] = $value;
            break;
        default:
            delete params[$param]
            break;
    }
    var x = [];
    for (p in params) {
        x.push(p + "=" + params[p]);
    }
    return str_param = x.join("&");
}

//   Add Cart
function addCart(id) {
    var item = database[id - 1];
    var newEle = {
        "id": id,
        "name": item.name,
        "price": item.price,
        "qty": 1
    }
    if (localStorage.getItem("cart") == null) {
        cart = [];
    }
    else {
        cart = JSON.parse(localStorage.getItem("cart"));
    }
    var find = false;
    cart.forEach(element => {
        if (element.id == id) {
            element.qty++;
            find = true;
        }
    });
    if (!find) {
        cart.push(newEle);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Add cart succeeded !");
}