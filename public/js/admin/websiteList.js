var websites=[];
const token = localStorage.getItem('jwtToken');


$(document).ready(function (){
    $("#websiteList").addClass('active');

    fetch('http://localhost:3000/api/websites', {
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
        websites = result;
        console.log("RÉUKLT",websites);
        // search();
        showWebsites(websites);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });

})

$(document).ready(function (){
    $(document).on('click', '.update-btn', function(event) {
        event.stopPropagation();
        console.log("update-btn");

        const websiteName = $(this).closest('.row-website').data('website-name');
        const noValue = websites.find(item => item.website === websiteName)?.no || null;
        const websiteLink = websites.find(item => item.website === websiteName)?.website_link || null;

        var updateWebsiteHTML = `
            <div id="row_${noValue}" class="row-website" data-website-name = "${websiteName}" data-website-no = "${noValue}">
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="website-name">Tên Website</label>
                        <input class="form-control website-name" type="text" placeholder="Tên Website" value="${websiteName}">
                    </div>
                    <div class="form-group col">
                        <label for="website-link">Link Website</label>
                        <input class="form-control website-link" type="text" placeholder="" value="${websiteLink}">
                    </div>
                </div>   
                <button class="save-update-website-btn" title="Cập nhật website này">Lưu</button>
            </div>

            `

        $('.window').empty().append(updateWebsiteHTML);
        $('.window').show();
    });

    $(document).on('click', '.save-update-website-btn', function(event) {
        event.stopPropagation();
        // const websiteName = $(this).closest('.row-website').data('website-name');
        // const noValue = websites.find(item => item.website === websiteName)?.no || null;
        // const websiteLink = websites.find(item => item.website === websiteName)?.website_link || null;

        const noValue = $(this).closest('.row-website').data('website-no');

        var $data = $(this).siblings('div');
        var websiteName = $data.find('.website-name').val().trim();
        var websiteLink = $data.find('.website-link').val().trim();

        var website = {
            no:noValue,
            website: websiteName,
            website_link : websiteLink
        }

        console.log("Cập nhật",website)
        if(!confirm("Xác nhận cập nhật website")) {
            return;
        }
        updateWebsite(website);
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
        const websiteName = $(this).closest('.row-website').data('website-name');
        const noValue = websites.find(item => item.website === websiteName)?.no || null;
        const websiteLink = websites.find(item => item.website === websiteName)?.website_link || null;

       
        var website = {
            no:noValue,
            website: websiteName,
            website_link : websiteLink
        }

        if(!confirm("Xác nhận xoá website")) {
            return;
        }
        deleteWebsite(website);
        
    });

})

function showWebsites (websites) {
// console.log("showWebsites",websites)

    if(!websites.length){
        showNotification("Không có trang web");
        return;
    }
    
    for(let i=0; i<websites.length; i++){
        const rowWebsiteHTML = `
        <tr id = "row_${websites[i].no}" class="row-website" data-website-name = "${websites[i].website}" data-website-link-name = "${websites[i].website_link}">
            <td class="website-name"><a href="${websites[i].website_link}">${websites[i].website}</a></td>
            <td class="website-link"><a href="${websites[i].website_link}">${websites[i].website_link}</a></td>
            <td class="action">
                <button title="Cập nhật dữ liệu" class="update-btn"><i class="fa-solid fa-pen"></i></button>
                <button title="Xoá" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
        `;

        $("tbody").append(rowWebsiteHTML);
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

function deleteWebsite (website) {
    fetch('http://localhost:3000/api/website', {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({website:website})
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
        // console.log("$(`#row_${website.website}`)",$(`#row_${website.website}`));
        var websiteNo = website.no;
        $(`#row_${websiteNo}`).remove();
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}

function updateWebsite (website) {
    console.log("updateWebsite",website);

    fetch('http://localhost:3000/api/website', {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({website:website})
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
            window.location.href = 'http://localhost:3000/websiteList';
        }, 500);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}