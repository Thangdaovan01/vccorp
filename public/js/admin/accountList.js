var accounts=[];
const token = localStorage.getItem('jwtToken');


$(document).ready(function (){
    $("#accountList").addClass('active');

    fetch('http://localhost:3000/api/accounts', {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
        }
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                showNotification(data.message);
                throw new Error('Network response was not ok');
            }
            return data;
        });
    })
    .then(result => {
        accounts = result;
        console.log("RÉUKLT",accounts);
        // search();
        showAccount(accounts);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });

})

$(document).ready(function (){
    $(document).on('click', '.update-btn', function(event) {
        event.stopPropagation();
        
    });

    $(document).on('click', '.delete-btn', function(event) {
        event.stopPropagation();
        const userId = $(this).closest('.row-account').data('user-id');
        // console.log(userId);
        if(!confirm("Xác nhận xoá tài khoản")) {
            return;
        }
        deleteAccount(userId);
        
    });

})

function showAccount (accounts) {
    if(!accounts.length){
        showNotification("Không có tài khoản");
        return;
    }
    
    for(let i=0; i<accounts.length; i++){
        const rowAccountHTML = `
        <tr id = "row_${accounts[i]._id}" class="row-account" data-user-id = "${accounts[i]._id}">
            <td class="fullname">${accounts[i].fullname}</td>
            <td class="user_name">${accounts[i].user_name}</td>
            <td class="action">
                <button title="Cập nhật dữ liệu" class="update-btn"><i class="fa-solid fa-pen"></i></button>
                <button title="Xoá" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
        `;

        $("tbody").append(rowAccountHTML);
    }
}

function showNotification(message) {
    $('#notificationText').text(message);
    $('#notification').show();
    setTimeout(() => {
        setTimeout(() => {
            $('#notification').addClass('right-slide');
        }, 10);
    }, 10);
    setTimeout(() => {
        $('#notification').removeClass('right-slide'); 
        setTimeout(() => {
            $('#notification').hide(); 
        }, 500);
    }, 3000); 
}

function deleteAccount (userId) {

    fetch('http://localhost:3000/api/account', {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({userId:userId})
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                showNotification(data.message);
                throw new Error('Network response was not ok');
            }
            return data;
        });
    })
    .then(result => {
        showNotification(result.message);
        $(`#row_${userId}`).remove();
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}