document.getElementById('main').style.display = 'none';
document.getElementById('signOutBtn').style.display = 'none';
document.getElementById('welcomeMsg').style.display='none';

document.getElementById('signInBtn').onclick = function(e){
    e.preventDefault();
    fetch('http://localhost:2022/login', {
        method: "POST",
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()}
        )
    .then(data=>{
        if(data.error){
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            alert('Invalid username/password');
        }else{
            // console.log(data.accessToken);
            document.getElementById('welcomeMsg').style.display='block';
            document.getElementById('welcomeMsg').innerHTML = `Welcome, ${data.accessToken.split('-')[1]}`;
            document.getElementById('signForm').style.display = 'none';
            sessionStorage.setItem('accessToken', data.accessToken);
            document.getElementById('signInBtn').style.display = 'none';
            document.getElementById('signOutBtn').style.display = 'block';
            document.getElementById('main').style.display = 'block';
            fetchData();
            let userId = data.accessToken.split('-')[0];
            fetchCart(userId);
        }
    })
}

document.getElementById('signOutBtn').onclick = function(){
    sessionStorage.clear();
    document.getElementById('main').style.display = 'none';
    document.getElementById('welcomeMsg').style.display='none';
    document.getElementById('signForm').style.display = 'block';
    document.getElementById('signOutBtn').style.display = 'none';
    document.getElementById('signInBtn').style.display = 'block';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

document.getElementById('placeOrderBtn').onclick = function(){
    let cartTable = document.getElementById('cartTable');
    let inventoryTable = document.getElementById('inventoryTable');
    let userId = sessionStorage.getItem('accessToken').split('-')[0];
    //gets rows of table
    var rowLength = cartTable.rows.length;

    //loops through rows    
    for (i = 1; i < rowLength; i++){

    //gets cells of current row
    var oCells = cartTable.rows.item(i).cells;
    //gets amount of cells of current row
    var cellLength = oCells.length;

    let index = -1;
    for(j=1; j<inventoryTable.rows.length; j++){
        var oCells2 = inventoryTable.rows.item(j).cells;
        if(oCells.item(1).innerHTML == oCells2.item(1).innerHTML){
            index = oCells2.item(0).innerHTML;
        }
    }

    fetch(`http://localhost:2022/users/${userId}/lineItems`, {
        method: 'DELETE',
        headers: {
            Authorization: `${sessionStorage.getItem('accessToken')}`
        }
    }).then(data =>{
        if(data.error){
            alert(data.error);
        }else{
                    fetchCart(userId);
                    fetchData();
                }})
    }
}

function fetchData(){
    fetch('http://localhost:2022/items', {
        headers: {
            Authorization: `${sessionStorage.getItem('accessToken')}`
        }
    }).then(response => {
        var Table = document.getElementById("tableBody");
	    Table.innerHTML = "";
        return response.json();
    })
        .then(data => {
            if(data.error){
                alert(data.error);
            } else {
                const table = document.getElementById("tableBody");
                data = data.filter(item => item.stock != 0);
                data.forEach( item => {
                    let row = table.insertRow();
                    let id = row.insertCell(0);
                    id.innerHTML = item.id;
                    let name = row.insertCell(1);
                    name.innerHTML = item.name;
                    let price = row.insertCell(2);
                    price.innerHTML = item.price;
                    const img = new Image(40, 40);
                    img.src = item.imageLink;
                    let image = row.insertCell(3);
                    image.appendChild(img);
                    let stock = row.insertCell(4);
                    stock.innerHTML = item.stock;
                    let action = row.insertCell(5);
                    let btn = document.createElement("button");
                    btn.onclick = () => addToCart(sessionStorage.getItem('accessToken').split('-')[0], item.id);
                    btn.innerHTML = "Add to cart";
                    action.appendChild(btn);
                    });
            }
        });
}

function fetchCart(userId){
    fetch(`http://localhost:2022/users/${userId}/items`, {
        headers: {
            Authorization: `${sessionStorage.getItem('accessToken')}`
        }
    }).then(response => {
        var Table = document.getElementById("cartBody");
	    Table.innerHTML = "";
        return response.json();
    }).then(data => {
            if(data.error){
                alert(data.error);
            } else {
                const table = document.getElementById("cartBody");
                if(data.length == 0){
                    document.getElementById('shoppingCartSection').style.display = 'none';
                    document.getElementById('emptyCartMsg').style.display = 'block';
                }else{
                    document.getElementById('emptyCartMsg').style.display = 'none';
                    document.getElementById('shoppingCartSection').style.display = 'block';
                    let userId = sessionStorage.getItem('accessToken').split('-')[0];
                    data
                    .forEach( item => {
                        let row = table.insertRow();
                        let id = row.insertCell(0);
                        id.innerHTML = item.lineItem.id;
                        let name = row.insertCell(1);
                        name.innerHTML = item.inventoryItem.name;
                        let inventoryPrice = row.insertCell(2);
                        inventoryPrice.innerHTML = item.inventoryItem.price;
                        let totalPrice = row.insertCell(3);
                        totalPrice.innerHTML = item.lineItem.price;
                        let quantity = row.insertCell(4);
                        let newBtn = document.createElement("button");
                        newBtn.onclick = ()=>{
                            if (document.getElementById(`count${item.lineItem.id}`).value > 1) {
                                    document.getElementById(`count${item.lineItem.id}`).value = --document.getElementById(`count${item.lineItem.id}`).value;
                                    fetch(`http://localhost:2022/users/${userId}/items?itemId=${item.inventoryItem.id}&newQty=${document.getElementById(`count${item.lineItem.id}`).value}`, {
                                    method: 'PATCH',
                                    headers: {
                                        Authorization: `${sessionStorage.getItem('accessToken')}`
                                    }
                                    }).then(data =>{
                                        if(data.error){
                                            alert(data.error);
                                        }else{
                                            fetchCart(userId);
                                            fetchData();
                                        }})
                                    
                                    calculateTotalPrice();
                            }
                        };
                        newBtn.innerHTML = " - ";
                        quantity.appendChild(newBtn);
                        let newInput = document.createElement("input");
                        newInput.type = "number";
                        newInput.min = "1";
                        newInput.value= item.lineItem.quantity;
                        newInput.id = `count${item.lineItem.id}`;
                        newInput.innerHTML = "quantity";
                        quantity.appendChild(newInput);
                        let newBtn2 = document.createElement("button");
                        newBtn2.onclick = ()=>{
                            if (document.getElementById(`count${item.lineItem.id}`).value < 999) {
                                document.getElementById(`count${item.lineItem.id}`).value = ++document.getElementById(`count${item.lineItem.id}`).value;
                                fetch(`http://localhost:2022/users/${userId}/items?itemId=${item.inventoryItem.id}&newQty=${document.getElementById(`count${item.lineItem.id}`).value}`, {
                                    method: 'PATCH',
                                    headers: {
                                        Authorization: `${sessionStorage.getItem('accessToken')}`
                                    }
                                    }).then(data =>{
                                        if(data.error){
                                            alert(data.error);
                                        }else{
                                            fetchCart(userId);
                                            fetchData();
                                        }})
                                    
                                    calculateTotalPrice();
                            }
                        };
                        newBtn2.innerHTML = " + ";
                        quantity.appendChild(newBtn2);
                        let action = row.insertCell(5);
                        let btn = document.createElement("button");
                        btn.onclick = () => fetch(`http://localhost:2022/users/${userId}/items?itemId=${item.inventoryItem.id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: `${sessionStorage.getItem('accessToken')}`
                            }
                        }).then(response => {
                            fetchCart(userId);
                            fetchData();
                        })
                        
                        btn.innerHTML = "Remove";
                        action.appendChild(btn);
                    });
                    calculateTotalPrice();
                }
                

            }
        });

}

function addToCart(userId, itemId){
    fetch(`http://localhost:2022/users/${userId}/items`, {
        method: 'POST',
        body:JSON.stringify({
                itemId: itemId,
                qty: 1
        }),
        headers: {
            Authorization: `${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        fetchCart(userId);
        fetchData();
    })
}

function changeQty(){
    document.getElementById('count${item.lineItem.id}').value = --document.getElementById('count${item.lineItem.id}').value;
    let cartTable = document.getElementById('cartTable');
    let inventoryTable = document.getElementById('inventoryTable');
    let userId = sessionStorage.getItem('accessToken').split('-')[0];
    //gets rows of table
    var rowLength = cartTable.rows.length;

    //loops through rows    
    for (i = 1; i < rowLength; i++){

    //gets cells of current row
    var oCells = cartTable.rows.item(i).cells;
    //gets amount of cells of current row
    var cellLength = oCells.length;

    let index = -1;
    for(j=1; j<inventoryTable.rows.length; j++){
        var oCells2 = inventoryTable.rows.item(j).cells;
        if(oCells.item(1).innerHTML == oCells2.item(1).innerHTML){
            index = oCells2.item(0).innerHTML;
        }
    }
    fetch(`http://localhost:2022/users/${userId}/items?itemId=${index}&newQty=${document.getElementById(`count${oCells.item(0).innerHTML}`).value}`, {
        method: 'PATCH',
        headers: {
            Authorization: `${sessionStorage.getItem('accessToken')}`
        }
    }).then(data =>{
        if(data.error){
            alert(data.error);
        }else{
            fetchCart(userId);
            fetchData();
        }})
    }
}

function removeFromCart(userId, itemId){
    fetch(`http://localhost:2022/users/${userId}/items`, {
        method: 'DELETE',
        body:JSON.stringify({
                itemId: itemId
        }),
        headers: {
            Authorization: `${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        fetchCart(userId);
        fetchData();
    })
}


function calculateTotalPrice(){
    let cartTable = document.getElementById('cartTable');
    //gets rows of table
    var rowLength = cartTable.rows.length;
    let totalPrice = 0;
    //loops through rows    
    for (i = 1; i < rowLength; i++){
    //gets cells of current row
    var oCells = cartTable.rows.item(i).cells;
    totalPrice += Number(oCells.item(3).innerHTML);
    } 
    document.getElementById('totalPrice').innerHTML = `Total Price: ${totalPrice}`;
}