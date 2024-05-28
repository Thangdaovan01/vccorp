var accounts=[];
var currAccount={};
const token = localStorage.getItem('jwtToken');

$(document).ready(function (){
    $("#accountList").addClass('active');

    fetch('http://localhost:3000/api/accounts', {
        method: "GET",
        headers: {
            "Content-Type" : "application/json",
            "Authorize" : token
        }
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                showNotification(data.message);
                window.location.href = 'http://localhost:3000/login-register';
                throw new Error('Network response was not ok');
            }
            return data;
        });
    })
    .then(result => {
        accounts = result.accounts;
        currAccount = result.currAccount;
        if(currAccount.role == 'admin'){
            showAccount(accounts);
        } else {
            window.location.href = 'http://localhost:3000/';
            showNotification("Bạn không có quyền thực hiện")
        }
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });

})

$(document).ready(function (){
    $(document).on('click', '.update-btn', function(event) {
        event.stopPropagation();

        const userId = $(this).closest('.row-account').data('user-id');
        const fullname = accounts.find(item => item._id === userId)?.fullname || null;
        const username = accounts.find(item => item._id === userId)?.user_name || null;
        const role = accounts.find(item => item._id === userId)?.role || null;
        var updateAccountHTML = ``;
        
        if(role == 'admin' && currAccount._id != userId){
            showNotification("Bạn không được chỉnh sửa tài khoản admin khác")
        }

        
        if(currAccount._id == userId){
            updateAccountHTML = `
            <div id="row_${userId}" class="row-account" data-user-id = "${userId}">
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="fullname">Họ và tên</label>
                        <input class="form-control fullname" type="text" placeholder="Họ và tên" value="${fullname}">
                    </div>
                    <div class="form-group col">
                        <label for="user_name">Tên đăng nhập</label>
                        <input class="form-control user_name" type="text" placeholder="" value="${username}" readonly>
                    </div>
                </div>   
                <button class="save-update-account-btn" title="Cập nhật tài khoản này">Lưu</button>
            </div>
            `
        } else if(role == 'admin'){
            showNotification("Bạn không được chỉnh sửa tài khoản admin khác")
            return
        } else {
            updateAccountHTML = `
            <div id="row_${userId}" class="row-account" data-user-id = "${userId}">
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="fullname">Họ và tên</label>
                        <input class="form-control fullname" type="text" placeholder="Họ và tên" value="${fullname}">
                    </div>
                    <div class="form-group col">
                        <label for="user_name">Tên đăng nhập</label>
                        <input class="form-control user_name" type="text" placeholder="" value="${username}" readonly>
                    </div>
                    <div class="form-group col">
                        <label for="role">Vai trò</label>
                        <select class="form-control" id="role-${userId}" name="role">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    
                </div>   
                <button class="save-update-account-btn" title="Cập nhật tài khoản này">Lưu</button>
            </div>
            `
        }
        $('.window').empty().append(updateAccountHTML);
        $('.window').show();
        
    });

    $(document).on('click', '.save-update-account-btn', function(event) {
        event.stopPropagation();
        const userId = $(this).closest('.row-account').data('user-id');

        var $data = $(this).siblings('div');
        var role='';
        if(currAccount._id == userId){
            role = 'admin'
        } else{
            role = $data.find(`#role-${userId}`).val().trim();
        }
        const username = accounts.find(item => item._id === userId)?.user_name || null;
        const password = accounts.find(item => item._id === userId)?.password || null;

        var fullname = $data.find('.fullname').val().trim();

        var account = {
            _id: userId,
            fullname: fullname,
            password: password,
            user_name: username,
            role:role,
        }

        if(!confirm("Xác nhận cập nhật tài khoản")) {
            return;
        }
        updateAccount(account);
    });

    $(document).on('click', function(event) {
        // Kiểm tra nếu click vào phần tử không phải là .create-row-container hoặc các phần tử con của nó
        if (!$(event.target).closest('.window').length) {
            // Ẩn đi phần tử .window
            $('.window').hide();
            $("body").children().removeClass("blur");
        }
    });

    $(document).on('click', '.delete-btn', function(event) {
        event.stopPropagation();
        const userId = $(this).closest('.row-account').data('user-id');
        
        if(userId == currAccount._id){
            if(!confirm("Xác nhận xoá tài khoản của chính bạn")){
                return;
            }
        } else if(!confirm("Xác nhận xoá tài khoản")) {
            return;
        }
        deleteAccount(userId);
        
    });
})

function showAccount (accounts) {
    if(!accounts.length){
        showNotification("Không có tài khoản");
        setTimeout(function() {
            window.location.href = 'http://localhost:3000/login-register';
        }, 500);
        return;
    }
    
    for(let i=0; i<accounts.length; i++){
        const rowAccountHTML = ` 
        <tr id = "row_${accounts[i]._id}" class="row-account" data-user-id = "${accounts[i]._id}">
            <td class="fullname">${accounts[i].fullname}</td>
            <td class="user_name">${accounts[i].user_name}</td>
            <td class="role">${accounts[i].role}</td>
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
            "Content-Type" : "application/json",
            "Authorize" : token
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
        const checkDeleteMyAccount = result.deleteMyAccount;
        if(checkDeleteMyAccount == 'true'){
            setTimeout(function() {
                window.location.href = 'http://localhost:3000/login-register';
            }, 500);
        } else if(checkDeleteMyAccount == 'false'){
            $(`#row_${userId}`).remove();
        }
        
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}


function updateAccount (account) {
    fetch('http://localhost:3000/api/account', {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json",
            "Authorize" : token
        },
        body: JSON.stringify({account:account})
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
        // var websiteNo = website.no;
        // $(`#row_${websiteNo}`).remove();
        setTimeout(function() {
            window.location.href = 'http://localhost:3000/accounts';
        }, 500);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}