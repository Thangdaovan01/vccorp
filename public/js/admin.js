var styles = [];
const token = localStorage.getItem('jwtToken');

$(document).ready(function() {
    fetch('http://localhost:3000/api/style', {
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
        styles = result;
        // console.log("RÉUKLT",styles[1]);
        // search();
        showData(styles);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
   

    $(document).on('click', '.create-row-container', function(event) { 
        event.stopPropagation();
        console.log("Button clicked!");
        // console.log(styles);

        var uniqueWebsites = styles.filter((item, index, array) => array.findIndex(i => i.website === item.website) === index)
                             .map(item => item.website);

        $("body").children().not(".window, .notification").addClass("blur");

        var coreNewRowHTML = ``

        coreNewRowHTML += `
            <div class="select-table-to-add">
                <h3>Dữ liệu mới</h3>
                <span>Website </span>
                <select class="form-control" id="select_table_to_add">
        `
        uniqueWebsites.forEach(function(optionValue) {
            // Thêm vào chuỗi HTML của phần tử <option> với giá trị và nội dung tương ứng
            coreNewRowHTML += `<option value="${optionValue}">${optionValue}</option>`;
        });
        coreNewRowHTML += `
                </select>
            </div>
        `

        $('.window').empty().append(coreNewRowHTML);
        $('.window').show();
    });

    $(document).on('change', '#select_table_to_add', function(event) { 
        event.stopPropagation();

        $('.window').children().not('.select-table-to-add').remove();
        var selectedValue = event.target.value;
        // console.log("Option change",selectedValue);
        var type = getTypeFromWebsite(selectedValue, styles);
        console.log("Option type",type);
        var coreNewRowHTML = ``
        coreNewRowHTML += `
            <div class="website-name" value="${selectedValue}"></div>
            <div class="form-group form-row">
                <div class="form-group col">
                    <label for="position">Vị trí (*)</label>
                    <input type="text" class="form-control" name="" id="position">
                </div>
                <div class="form-group col">
                    <label for="platform">Nền tảng</label>
                    <select class="form-control" name="" id="platform">
                        <option value="PC">PC</option>
                        <option value="Mobile">Mobile</option>
                        <option value="PC & Mobile">PC & Mobile</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="dimensions">Kích thước (*)</label>
                <textarea class="form-control" id="dimensions" name="dimensions" rows="5" cols="50"></textarea>
            </div>
            <div class="demo-container form-group">
                <label for="demo">DEMO (*)</label>

                <div class="form-row form-group">
                    <input class="form-control col content" type="text" placeholder="Content">
                    <input class="form-control col link-demo" type="text" placeholder="Link demo">
                </div>
                <button class="add-demo " title="Thêm demo"><i class="fa-solid fa-plus"></i></button>

            </div>
        `
            if (type === 1) {
                coreNewRowHTML += `
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="buying_method">Buying Method</label>
                        <select class="form-control" id="buying_method" name="buying_method">
                            <option value="Độc quyền ngày">Độc quyền ngày</option>
                            <option value="Chia sẻ 5/ngày">Chia sẻ 5/ngày</option>
                            <option value="Chia sẻ 5/tuần">Chia sẻ 5/tuần</option>
                        </select>
                    </div>
                    <div class="form-group col">
                        <label for="homepage">Homepage (Price)</label>
                        <input type="number" class="form-control" id="homepage" name="homepage">
                    </div>
                </div>
        
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="cross_site_roadblock">Cross-site roadblock</label>
                        <input type="text" class="form-control" id="cross_site_roadblock" name="cross_site_roadblock">
                    </div>
                    <div class="form-group col">
                        <label for="ctr">Average CTR (%)</label>
                        <input type="text" class="form-control" id="ctr" name="ctr">
                    </div>
                    <div class="form-group">
                        <label for="est">Est</label>
                        <input type="text" class="form-control" id="est" name="est">
                    </div>
                </div>
                    
                `;
            } else if (type === 2) {
                coreNewRowHTML += `
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="buying_method">Buying Method</label>
                        <select class="form-control" id="buying_method" name="buying_method">
                            <option value="Độc quyền ngày">Độc quyền ngày</option>
                            <option value="Chia sẻ 5/ngày">Chia sẻ 5/ngày</option>
                            <option value="Chia sẻ 5/tuần">Chia sẻ 5/tuần</option>
                        </select>
                    </div>
                    <div class="form-group col">
                        <label for="homepage">Homepage (Price)</label>
                        <input type="number" class="form-control" id="homepage" name="homepage">
                    </div>
                </div>
        
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="note">Note</label>
                        <input type="text" class="form-control" id="note" name="note">
                    </div>
                    <div class="form-group col">
                        <label for="ctr">Average CTR (%)</label>
                        <input type="text" class="form-control" id="ctr" name="ctr">
                    </div>
                    <div class="form-group">
                        <label for="est">Est</label>
                        <input type="text" class="form-control" id="est" name="est">
                    </div>
                </div>
                `;
            } else if (type === 3) {
                coreNewRowHTML += `
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="buying_method">Buying Method</label>
                        <select class="form-control" id="buying_method" name="buying_method">
                            <option value="Độc quyền ngày">Độc quyền ngày</option>
                            <option value="Chia sẻ 5/ngày">Chia sẻ 5/ngày</option>
                            <option value="Chia sẻ 5/tuần">Chia sẻ 5/tuần</option>
                        </select>
                    </div>
                    <div class="form-group col">
                        <label for="homepage">Homepage (Price)</label>
                        <input type="number" class="form-control" id="homepage" name="homepage">
                    </div>
                </div>
        
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="xuyentrang">Xuyên trang</label>
                        <input type="number" class="form-control" id="xuyentrang" name="xuyentrang">
                    </div>
                    <div class="form-group col">
                        <label for="chuyenmuc">Chuyên mục</label>
                        <input type="number" class="form-control" id="chuyenmuc" name="chuyenmuc">
                    </div>
                    <div class="form-group">
                        <label for="est">Est</label>
                        <input type="text" class="form-control" id="est" name="est">
                    </div>
                </div>
                `;
            } else if (type === 4) {
                coreNewRowHTML += `
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="buying_method">Buying Method</label>
                        <select class="form-control" id="buying_method" name="buying_method">
                            <option value="Độc quyền ngày">Độc quyền ngày</option>
                            <option value="Chia sẻ 5/ngày">Chia sẻ 5/ngày</option>
                            <option value="Chia sẻ 5/tuần">Chia sẻ 5/tuần</option>
                        </select>
                    </div>
                    <div class="form-group col">
                        <label for="homepage">Homepage (Price)</label>
                        <input type="number" class="form-control" id="homepage" name="homepage" >
                    </div>
                </div>
        
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="cross_site_roadblock">Cross-site roadblock</label>
                        <input type="text" class="form-control" id="cross_site_roadblock" name="cross_site_roadblock">
                    </div>
                    <div class="form-group col">
                        <label for="ctr">Average CTR (%)</label>
                        <input type="text" class="form-control" id="ctr" name="ctr">
                    </div>
                    <div class="form-group">
                        <label for="est">Est</label>
                        <input type="text" class="form-control" id="est" name="est">
                    </div>
                </div>
                `;
            } else if (type === 5) {
                coreNewRowHTML += `
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="ctr">Ctr </label>
                        <input type="text" class="form-control" id="ctr" name="ctr">
                    </div>
                    <div class="form-group col">
                        <label for="est">Est</label>
                        <input type="text" class="form-control" id="est" name="est">
                    </div>
                </div>
        
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="week">Tuần</label>
                        <input type="number" class="form-control" id="week" name="week">
                    </div>
                    <div class="form-group col">
                        <label for="month">Tháng</label>
                        <input type="number" class="form-control" id="month" name="month">
                    </div>
                    <div class="form-group col">
                        <label for="quarter">Quý</label>
                        <input type="number" class="form-control" id="quarter" name="quarter">
                    </div>
                </div>
                `;
            }
            type = 0;
        
        coreNewRowHTML += `<button class="save-new-website">SAVE</button>`
        $('.window').append(coreNewRowHTML);
        $('.window').show();
        
    });

    $(document).on('click', '.save-new-website', function(event) {
        event.stopPropagation();
        console.log('click .save-new-website')

        var $data = $(this).siblings('div');
        
        var website = $(this).siblings('div.website-name').attr('value');
        var website_link = getWeblinkFromWebsite(website, styles);
        var no = getNoFromWebsite(website, styles);
        var position = $data.find('#position').val().trim();
        var dimensions = $data.find('#dimensions').val().trim();
        var platform = $data.find('#platform').val().trim();
        var type = getTypeFromWebsite(website, styles);
        

        // console.log(type,website, position, dimensions, platform, buying_method, homepage, cross_site_roadblock, ctr, est)

        // Khởi tạo hai mảng để lưu giá trị
        var contentValues = [];
        var linkDemoValues = [];

        // Trích xuất dữ liệu từ các cặp input trong .demo-container
        $data.find('.content').each(function() {
            contentValues.push($(this).val());
        });

        $data.find('.link-demo').each(function() {
            linkDemoValues.push($(this).val());
        });
        console.log("contentValues", contentValues);

    
        if (position == '') {
            showNotification('Hãy điền Position');
            return
        }
        if (dimensions == '') {
            showNotification('Hãy điền Dimensions');
            return
        }
    
        if (contentValues == '' || linkDemoValues == '') {
            showNotification('Hãy điền ít nhất một demo');
            return
        }

        if (!confirm('Lưu dữ liệu mới')) {
            return
        }
        
        var newRow = {};

        if(type===1){
            var buying_method = $data.find('#buying_method').val().trim();
            var homepage = $data.find('#homepage').val().trim();
            var cross_site_roadblock = $data.find('#cross_site_roadblock').val().trim();
            var ctr = $data.find('#ctr').val().trim();
            var est = $data.find('#est').val().trim();
            newRow = {
                type: type,
                no: no,
                website_link: website_link,
                website: website,
                position: position,
                dimensions: dimensions,
                platform: platform,
                demo: contentValues,
                demo_link: linkDemoValues,
                buying_method: buying_method,
                homepage: homepage,
                cross_site_roadblock: cross_site_roadblock,
                ctr: ctr,
                est: est 
            }
        }
    

        if(type===2){
            var buying_method = $data.find('#buying_method').val().trim();
            var homepage = $data.find('#homepage').val().trim();
            var note = $data.find('#note').val().trim();
            var ctr = $data.find('#ctr').val().trim();
            var est = $data.find('#est').val().trim();
            newRow = {
                type: type,
                no: no,
                website_link: website_link,
                website: website,
                position: position,
                dimensions: dimensions,
                platform: platform,
                demo: contentValues,
                demo_link: linkDemoValues,
                buying_method: buying_method,
                homepage: homepage,
                note: note,
                ctr: ctr,
                est: est 
            }
        }

        if(type===3){
            var buying_method = $data.find('#buying_method').val().trim();
            var homepage = $data.find('#homepage').val().trim();
            var xuyentrang = $data.find('#xuyentrang').val().trim();
            var chuyenmuc = $data.find('#chuyenmuc').val().trim();
            var est = $data.find('#est').val().trim();
            newRow = {
                type: type,
                no: no,
                website_link: website_link,
                website: website,
                position: position,
                dimensions: dimensions,
                platform: platform,
                demo: contentValues,
                demo_link: linkDemoValues,
                buying_method: buying_method,
                homepage: homepage,
                xuyentrang: xuyentrang,
                chuyenmuc: chuyenmuc,
                est: est 
            }
        }

        if(type===4){
            var buying_method = $data.find('#buying_method').val().trim();
            var homepage = $data.find('#homepage').val().trim();
            var cross_site_roadblock = $data.find('#cross_site_roadblock').val().trim();
            var ctr = $data.find('#ctr').val().trim();
            var est = $data.find('#est').val().trim();
            newRow = {
                type: type,
                no: no,
                website_link: website_link,
                website: website,
                position: position,
                dimensions: dimensions,
                platform: platform,
                demo: contentValues,
                demo_link: linkDemoValues,
                buying_method: buying_method,
                homepage: homepage,
                cross_site_roadblock: cross_site_roadblock,
                ctr: ctr,
                est: est 
            }
        }

        if(type===5){
            var week = $data.find('#week').val().trim();
            var month = $data.find('#month').val().trim();
            var quarter = $data.find('#quarter').val().trim();
            var ctr = $data.find('#ctr').val().trim();
            var est = $data.find('#est').val().trim();
            newRow = {
                type: type,
                no: no,
                website_link: website_link,
                website: website,
                position: position,
                dimensions: dimensions,
                platform: platform,
                demo: contentValues,
                demo_link: linkDemoValues,
                week: week,
                month: month,
                quarter: quarter,
                ctr: ctr,
                est: est 
            }
        }

        creatNewRow(newRow);
    }); 

    $(document).on('click', '#update', function(event) { 
        event.stopPropagation();
        $("body").children().not(".window, .notification").addClass("blur");

        var selectedValue = $(this).data('value');
        var currentRow = styles.filter(function(item) { return item._id === selectedValue; });
        // console.log("currentRow",currentRow);
        var type = currentRow[0].type;
        var currentWebsite = currentRow[0].website;

        var coreNewRowHTML = ``
        var demoRowHTML = ``
        demoRowHTML += `
        <div class="demo-container form-group">
            <label for="demo">DEMO (*)</label>
        `
        for (var j = 0; j < currentRow[0].demo.length; j++) {
            demoRowHTML += `
            <div class="form-row form-group">
                <input class="form-control col content" type="text" placeholder="Content" value="${currentRow[0].demo[j]}">
                <input class="form-control col link-demo" type="text" placeholder="Link demo" value="${currentRow[0].demo_link[j]}">
                <button class="remove-demo" title="Loại bỏ demo này"><i class="fa-solid fa-xmark"></i></button>
            </div>
            `;
        }
        demoRowHTML += `    
            <button class="add-demo " title="Thêm demo"><i class="fa-solid fa-plus"></i></button>
        </div>
        `
        
        coreNewRowHTML += `
            <h3>Cập nhật </h3>

            <div class="website-name form-group" value="${selectedValue}">
                <label for="website">Tên website (*)</label>
                <input type="text" class="form-control" name="" id="website" value="${currentWebsite}" readonly>
            </div>
            <div class="form-group form-row">
                <div class="form-group col">
                    <label for="position">Vị trí (*)</label>
                    <input type="text" class="form-control" name="" id="position" value="${currentRow[0].position}">
                </div>
                <div class="form-group col">
                    <label for="platform">Nền tảng</label>
                    <select class="form-control" name="" id="platform">
                        <option value="PC">PC</option>
                        <option value="Mobile">Mobile</option>
                        <option value="PC & Mobile">PC & Mobile</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="dimensions">Kích thước (*)</label>
                <textarea class="form-control" id="dimensions" name="dimensions" rows="5" cols="50" value="${currentRow[0].dimensions}">${currentRow[0].dimensions}</textarea>
            </div>
            ${ demoRowHTML }
        `
            if (type === 1) {
                coreNewRowHTML += `
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="buying_method">Buying Method</label>
                        <select class="form-control" id="buying_method" name="buying_method">
                            <option value="Độc quyền ngày">Độc quyền ngày</option>
                            <option value="Chia sẻ 5/ngày">Chia sẻ 5/ngày</option>
                            <option value="Chia sẻ 5/tuần">Chia sẻ 5/tuần</option>
                        </select>
                    </div>
                    <div class="form-group col">
                        <label for="homepage">Homepage (Price)</label>
                        <input type="number" class="form-control" id="homepage" name="homepage" value="${currentRow[0].homepage}" >
                    </div>
                </div>
        
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="cross_site_roadblock">Cross-site roadblock</label>
                        <input type="text" class="form-control" id="cross_site_roadblock" name="cross_site_roadblock" value="${currentRow[0].cross_site_roadblock}">
                    </div>
                    <div class="form-group col">
                        <label for="ctr">Average CTR (%)</label>
                        <input type="text" class="form-control" id="ctr" name="ctr" value="${currentRow[0].ctr}">
                    </div>
                    <div class="form-group">
                        <label for="est">Est</label>
                        <input type="text" class="form-control" id="est" name="est" value="${currentRow[0].est}">
                    </div>
                </div>
                `;
            } else if (type === 2) {
                coreNewRowHTML += `
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="buying_method">Buying Method</label>
                        <select class="form-control" id="buying_method" name="buying_method">
                            <option value="Độc quyền ngày">Độc quyền ngày</option>
                            <option value="Chia sẻ 5/ngày">Chia sẻ 5/ngày</option>
                            <option value="Chia sẻ 5/tuần">Chia sẻ 5/tuần</option>
                        </select>
                    </div>
                    <div class="form-group col">
                        <label for="homepage">Homepage (Price)</label>
                        <input type="number" class="form-control" id="homepage" name="homepage" value="${currentRow[0].homepage}">
                    </div>
                </div>
        
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="note">Note</label>
                        <input type="text" class="form-control" id="note" name="note" value="${currentRow[0].note}">
                    </div>
                    <div class="form-group col">
                        <label for="ctr">Average CTR (%)</label>
                        <input type="text" class="form-control" id="ctr" name="ctr" value="${currentRow[0].ctr}">
                    </div>
                    <div class="form-group">
                        <label for="est">Est</label>
                        <input type="text" class="form-control" id="est" name="est" value="${currentRow[0].est}">
                    </div>
                </div>
                `;
            } else if (type === 3) {
                coreNewRowHTML += `
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="buying_method">Buying Method</label>
                        <select class="form-control" id="buying_method" name="buying_method">
                            <option value="Độc quyền ngày">Độc quyền ngày</option>
                            <option value="Chia sẻ 5/ngày">Chia sẻ 5/ngày</option>
                            <option value="Chia sẻ 5/tuần">Chia sẻ 5/tuần</option>
                        </select>
                    </div>
                    <div class="form-group col">
                        <label for="homepage">Homepage (Price)</label>
                        <input type="number" class="form-control" id="homepage" name="homepage" value="${currentRow[0].homepage}">
                    </div>
                </div>
        
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="xuyentrang">Xuyên trang</label>
                        <input type="number" class="form-control" id="xuyentrang" name="xuyentrang" value="${currentRow[0].xuyentrang}">
                    </div>
                    <div class="form-group col">
                        <label for="chuyenmuc">Chuyên mục</label>
                        <input type="number" class="form-control" id="chuyenmuc" name="chuyenmuc" value="${currentRow[0].chuyenmuc}">
                    </div>
                    <div class="form-group">
                        <label for="est">Est</label>
                        <input type="text" class="form-control" id="est" name="est" value="${currentRow[0].est}">
                    </div>
                </div>
                `;
            } else if (type === 4) {
                coreNewRowHTML += `
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="buying_method">Buying Method</label>
                        <select class="form-control" id="buying_method" name="buying_method">
                            <option value="Độc quyền ngày">Độc quyền ngày</option>
                            <option value="Chia sẻ 5/ngày">Chia sẻ 5/ngày</option>
                            <option value="Chia sẻ 5/tuần">Chia sẻ 5/tuần</option>
                        </select>
                    </div>
                    <div class="form-group col">
                        <label for="homepage">Homepage (Price)</label>
                        <input type="number" class="form-control" id="homepage" name="homepage" value="${currentRow[0].homepage}" >
                    </div>
                </div>
        
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="cross_site_roadblock">Cross-site roadblock</label>
                        <input type="text" class="form-control" id="cross_site_roadblock" name="cross_site_roadblock" value="${currentRow[0].cross_site_roadblock}">
                    </div>
                    <div class="form-group col">
                        <label for="ctr">Average CTR (%)</label>
                        <input type="text" class="form-control" id="ctr" name="ctr" value="${currentRow[0].ctr}">
                    </div>
                    <div class="form-group">
                        <label for="est">Est</label>
                        <input type="text" class="form-control" id="est" name="est" value="${currentRow[0].est}">
                    </div>
                </div>
                `;
            } else if (type === 5) {
                coreNewRowHTML += `
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="ctr">Ctr </label>
                        <input type="text" class="form-control" id="ctr" name="ctr" value="${currentRow[0].ctr}">
                    </div>
                    <div class="form-group col">
                        <label for="est">Est</label>
                        <input type="text" class="form-control" id="est" name="est" value="${currentRow[0].est}">
                    </div>
                </div>
        
                <div class="form-group form-row">
                    <div class="form-group col">
                        <label for="week">Tuần</label>
                        <input type="number" class="form-control" id="week" name="week" value="${currentRow[0].week}">
                    </div>
                    <div class="form-group col">
                        <label for="month">Tháng</label>
                        <input type="number" class="form-control" id="month" name="month" value="${currentRow[0].month}">
                    </div>
                    <div class="form-group col">
                        <label for="quarter">Quý</label>
                        <input type="number" class="form-control" id="quarter" name="quarter" value="${currentRow[0].quarter}">
                    </div>
                </div>
                `;
            }
            type = 0;
        
        coreNewRowHTML += `<button class="save-update-website">SAVE</button>`
        $('.window').empty().append(coreNewRowHTML);
        $('.window').show();
        
    });

    $(document).on('click', '.save-update-website', function(event) {
        event.stopPropagation();
        console.log('click .save-update-website')

        var $data = $(this).siblings('div');
        // console.log($data)
    
        var id = $(this).siblings('div.website-name').attr('value');
        var currentRow = styles.filter(function(item) { return item._id === id; });
        // console.log("currentRow",currentRow);
        var type = currentRow[0].type;
        var website = currentRow[0].website;

        var website_link = currentRow[0].website_link;
        var no = currentRow[0].no;
        var position = $data.find('#position').val().trim();
        var dimensions = $data.find('#dimensions').val().trim();
        var platform = $data.find('#platform').val().trim();
        

        console.log(type, website, position, dimensions, platform, buying_method, homepage, cross_site_roadblock, ctr, est)

        // Khởi tạo hai mảng để lưu giá trị
        var contentValues = [];
        var linkDemoValues = [];

        // Trích xuất dữ liệu từ các cặp input trong .demo-container
        $data.find('.content').each(function() {
            contentValues.push($(this).val());
        });

        $data.find('.link-demo').each(function() {
            linkDemoValues.push($(this).val());
        });
        console.log("contentValues", contentValues);

    
        if (position == '') {
            showNotification('Hãy điền Position');
            return
        }
        if (dimensions == '') {
            showNotification('Hãy điền Dimensions');
            return
        }
    
        if (contentValues == '' || linkDemoValues == '') {
            showNotification('Hãy điền ít nhất một demo');
            return
        }

        if (!confirm('Lưu dữ liệu mới')) {
            return
        }
        
        var updaterow = {};

        if(type===1){
            var buying_method = $data.find('#buying_method').val().trim();
            var homepage = $data.find('#homepage').val().trim();
            var cross_site_roadblock = $data.find('#cross_site_roadblock').val().trim();
            var ctr = $data.find('#ctr').val().trim();
            var est = $data.find('#est').val().trim();
            updaterow = {
                _id: id,
                type: type,
                no: no,
                website_link: website_link,
                website: website,
                position: position,
                dimensions: dimensions,
                platform: platform,
                demo: contentValues,
                demo_link: linkDemoValues,
                buying_method: buying_method,
                homepage: homepage,
                cross_site_roadblock: cross_site_roadblock,
                ctr: ctr,
                est: est 
            }
        }

        if(type===2){
            var buying_method = $data.find('#buying_method').val().trim();
            var homepage = $data.find('#homepage').val().trim();
            var note = $data.find('#note').val().trim();
            var ctr = $data.find('#ctr').val().trim();
            var est = $data.find('#est').val().trim();
            updaterow = {
                _id: id,
                type: type,
                no: no,
                website_link: website_link,
                website: website,
                position: position,
                dimensions: dimensions,
                platform: platform,
                demo: contentValues,
                demo_link: linkDemoValues,
                buying_method: buying_method,
                homepage: homepage,
                note: note,
                ctr: ctr,
                est: est 
            }
        }

        if(type===3){
            var buying_method = $data.find('#buying_method').val().trim();
            var homepage = $data.find('#homepage').val().trim();
            var xuyentrang = $data.find('#xuyentrang').val().trim();
            var chuyenmuc = $data.find('#chuyenmuc').val().trim();
            var est = $data.find('#est').val().trim();
            updaterow = {
                _id: id,
                type: type,
                no: no,
                website_link: website_link,
                website: website,
                position: position,
                dimensions: dimensions,
                platform: platform,
                demo: contentValues,
                demo_link: linkDemoValues,
                buying_method: buying_method,
                homepage: homepage,
                xuyentrang: xuyentrang,
                chuyenmuc: chuyenmuc,
                est: est 
            }
        }

        if(type===4){
            var buying_method = $data.find('#buying_method').val().trim();
            var homepage = $data.find('#homepage').val().trim();
            var cross_site_roadblock = $data.find('#cross_site_roadblock').val().trim();
            var ctr = $data.find('#ctr').val().trim();
            var est = $data.find('#est').val().trim();
            updaterow = {
                _id: id,
                type: type,
                no: no,
                website_link: website_link,
                website: website,
                position: position,
                dimensions: dimensions,
                platform: platform,
                demo: contentValues,
                demo_link: linkDemoValues,
                buying_method: buying_method,
                homepage: homepage,
                cross_site_roadblock: cross_site_roadblock,
                ctr: ctr,
                est: est 
            }
        }

        if(type===5){
            var week = $data.find('#week').val().trim();
            var month = $data.find('#month').val().trim();
            var quarter = $data.find('#quarter').val().trim();
            var ctr = $data.find('#ctr').val().trim();
            var est = $data.find('#est').val().trim();
            updaterow = {
                _id: id,
                type: type,
                no: no,
                website_link: website_link,
                website: website,
                position: position,
                dimensions: dimensions,
                platform: platform,
                demo: contentValues,
                demo_link: linkDemoValues,
                week: week,
                month: month,
                quarter: quarter,
                ctr: ctr,
                est: est 
            }
        }
        console.log("updateRow", updaterow);
        updateRow(updaterow);
        // creatNewRow(newRow);
    });

    $(document).on('click', function(event) {
        // Kiểm tra nếu click vào phần tử không phải là .create-row-container hoặc các phần tử con của nó
        if (!$(event.target).closest('.window').length) {
            // Ẩn đi phần tử .window
            $('.window').hide();
            $("body").children().removeClass("blur");

        }
    });

    $(document).on('click', '.add-demo', function(event) {
        event.stopPropagation();

        var newElement = `
                <div class="form-row form-group">
                    <input class="form-control col content" type="text" placeholder="Content">
                    <input class="form-control col link-demo" type="text" placeholder="Link demo">
                <button class="remove-demo" title="Loại bỏ demo này"><i class="fa-solid fa-xmark"></i></button>

                </div>

        `;
        
        $(this).before(newElement);
    });

    $(document).on('click', '.remove-demo', function(event) {
        event.stopPropagation();
        
        $(this).closest('div').remove();
    });

    $(document).on('click', '.Xbutton', function(event) {
        event.stopPropagation();

        if (!skipConfirm) {
            if (!confirm("Bạn muốn tắt cửa sổ này khi chưa lưu thay đổi ?")) {
                return
            }
        }
        $('.window').empty().hide();
        $("body").children().removeClass("blur");
    });

    

});


async function showData(excels) {
    let table_1 = excels.filter(item => item.type === 1);
    // console.log("excelsTypeOne",table_1);
    showData1(table_1);

    let table_2 = excels.filter(item => item.type === 2);
    showData2(table_2);

    let table_3 = excels.filter(item => item.type === 3);
    showData3(table_3);

    let table_4 = excels.filter(item => item.type === 4);
    showData4(table_4);

    let table_5 = excels.filter(item => item.type === 5);
    showData5(table_5);
}

async function showData1(excels) {
    var headerTableHTML1 = `
        <tr class="header-table" id="header_table_1">
            <th class="action">Action</th>
            <th class="website1">Website</th>
            <th class="position">Vị trí</th>
            <th class="dimensions1">Kích thước</th>
            <th class="platform">Nền tảng</th>
            <th class="demo1">Demo</th>
            <th class="buying_method">Cách tính giá</th>
            <th class="homepage">Trang chủ</th>
            <th class="cross_site_roadblock">Roadblock xuyên site</th>
            <th class="ctr">Average CTR (%)</th>
            <th class="est">Est. </th>
        </tr>
    `;

    var theadElement = document.querySelector(`#table_${ excels[0].type } thead`);
    theadElement.innerHTML = headerTableHTML1;

    var currentWebsite = "";
    var rowspanWebsite = 0, rowspanPosition = 0, rowspanPlatform = 0, rowspanDemo = 0;
    var dataLength = excels.length;
    // console.log("datalength",dataLength);

    for (let i = 0; i < dataLength; i++) {
        // console.log("data",i);

        if (excels[i].website != currentWebsite) {   
            // console.log("excels[i].websit - currentWebsite",excels[i].website, currentWebsite);         
            currentWebsite = excels[i].website;
            var headerWebsiteHTML = `
                <tr class="header-website" id="header_table_${ excels[i].website }" title="${ excels[i].website_link }">
                    <th colspan="11"><a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website.toUpperCase() }</a></th>
                </tr>
            `;
            // console.log("headerWebsiteHTML",headerWebsiteHTML);
            $(`#table_${ excels[0].type } tbody`).append(headerWebsiteHTML);
        }

        var setDemo = "";
        for (let j = 0; j < excels[i].demo.length; j++) { 
            setDemo += `<div class="demo-item">
                <a href="${ excels[i].demo_link[j] }" target="_blank" >${ excels[i].demo[j] }</a> 
            </div>`;
            // console.log("setDemo",setDemo);
        }
        var setDemoHTML = ``;
        setDemoHTML = `<td class="demo"><div>${ setDemo }</div></td>`;

        var row = `` 
        row += `
        <tr class="row-table" id='${ excels[i]._id }'>
            <td class="action">
                <button id="update" data-value="${ excels[i]._id }" title="Cập nhật dữ liệu" class="btn update-btn btn-link"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteRow('${ excels[i]._id }');" title="Xoá" class="btn delete-btn btn-link"><i class="fa-solid fa-trash"></i></button>
            </td>
            <td class="website"><a href=${ excels[i].website_link } target="_blank" >${ excels[i].website }</a></td>
            <td class="position">${ excels[i].position }</td>
            <td class="dimensions new-line">${ excels[i].dimensions }</td>
            <td class="platform">${ excels[i].platform }</td>

            ${ setDemoHTML }

            <td class="buying_method new-line">${ excels[i].buying_method }</td>
            <td class="homepage">${ excels[i].homepage ? numterToString(excels[i].homepage) : "" }</td>
            <td class="cross_site_roadblock">${ excels[i].cross_site_roadblock }</td>
            <td class="ctr">${ excels[i].ctr ? numterToString(excels[i].ctr) : ""}</td>
            <td class="est">${ excels[i].est }</td>
        </tr>
        `;

        // document.querySelector(`#table_${ excels[0].type } tbody`).innerHTML = row;
        // document.querySelector(`#table_${ excels[0].type } tbody`).insertAdjacentHTML('beforeend', row);
        $(`#table_${ excels[0].type } tbody`).append(row);

        // console.log("row",row);

    }

}

async function showData2(excels) {
    var headerTableHTML1 = `
        <tr class="header-table" id="header_table_2">
            <th class="action">Action</th>
            <th class="website1">Website</th>
            <th class="position">Vị trí</th>
            <th class="dimensions1">Kích thước</th>
            <th class="platform">Nền tảng</th>
            <th class="demo1">Demo</th>
            <th class="buying_method">Cách tính giá</th>
            <th class="homepage">Đơn giá</th>
            <th class="cross_site_roadblock">CTR Trung bình</th>
            <th class="ctr">Est.</th>
            <th class="est">Note</th>
        </tr>
    `;

    var theadElement = document.querySelector(`#table_${ excels[0].type } thead`);
    theadElement.innerHTML = headerTableHTML1;

    var currentWebsite = "";
    var dataLength = excels.length;

    for (let i = 0; i < dataLength; i++) {
        if (excels[i].website != currentWebsite) {   
            currentWebsite = excels[i].website;
            var headerWebsiteHTML = `
                <tr class="header-website" id="header_table_${ excels[i].website }" title="${ excels[i].website_link }">
                    <th colspan="11"><a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website.toUpperCase() }</a></th>
                </tr>
            `;
            $(`#table_${ excels[0].type } tbody`).append(headerWebsiteHTML);
        }

        var setDemo = "";
        for (let j = 0; j < excels[i].demo.length; j++) { 
            setDemo += `<div class="demo-item">
                <a href="${ excels[i].demo_link[j] }" target="_blank" >${ excels[i].demo[j] }</a> 
            </div>`;
        }
        var setDemoHTML = ``;
        setDemoHTML = `<td class="demo"><div>${ setDemo }</div></td>`;

        var row = `` 
        row += `
        <tr class="row-table" id='${ excels[i]._id }'>
            <td class="action">
                <button id="update" data-value="${ excels[i]._id }" title="Cập nhật dữ liệu" class="btn update-btn btn-link"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteRow('${ excels[i]._id }');" title="Xoá" class="btn delete-btn btn-link"><i class="fa-solid fa-trash"></i></button>
            </td>
            <td class="website"><a href=${ excels[i].website_link } target="_blank" >${ excels[i].website }</a></td>
            <td class="position">${ excels[i].position }</td>
            <td class="dimensions new-line">${ excels[i].dimensions }</td>
            <td class="platform">${ excels[i].platform }</td>

            ${ setDemoHTML }

            <td class="buying_method new-line">${ excels[i].buying_method }</td>
            <td class="homepage">${ excels[i].price ? numterToString(excels[i].price) : "" }</td>
            <td class="cross_site_roadblock">${ excels[i].ctr }</td>
            <td class="ctr">${ excels[i].est }</td>
            <td class="est">${ excels[i].note }</td>
        </tr>
        `;

        $(`#table_${ excels[0].type } tbody`).append(row);
    }

}

async function showData3(excels) {
    var headerTableHTML1 = `
        <tr class="header-table" id="header_table_3">
            <th class="action">Action</th>
            <th class="website1">Website</th>
            <th class="position">Vị trí</th>
            <th class="dimensions1">Kích thước</th>
            <th class="platform">Nền tảng</th>
            <th class="demo1">Demo</th>
            <th class="buying_method">Cách tính giá</th>
            <th class="homepage">Trang chủ</th>
            <th class="cross_site_roadblock">Xuyên trang</th>
            <th class="ctr">Chuyên mục</th>
            <th class="est">Est</th>
        </tr>
    `;

    var theadElement = document.querySelector(`#table_${ excels[0].type } thead`);
    theadElement.innerHTML = headerTableHTML1;

    var currentWebsite = "";
    var dataLength = excels.length;

    for (let i = 0; i < dataLength; i++) {
        if (excels[i].website != currentWebsite) {   
            currentWebsite = excels[i].website;
            var headerWebsiteHTML = `
                <tr class="header-website" id="header_table_${ excels[i].website }" title="${ excels[i].website_link }">
                    <th colspan="11"><a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website.toUpperCase() }</a></th>
                </tr>
            `;
            $(`#table_${ excels[0].type } tbody`).append(headerWebsiteHTML);
        }

        var setDemo = "";
        for (let j = 0; j < excels[i].demo.length; j++) { 
            setDemo += `<div class="demo-item">
                <a href="${ excels[i].demo_link[j] }" target="_blank" >${ excels[i].demo[j] }</a> 
            </div>`;
        }
        var setDemoHTML = ``;
        setDemoHTML = `<td class="demo"><div>${ setDemo }</div></td>`;

        var row = `` 
        row += `
        <tr class="row-table" id='${ excels[i]._id }'>
            <td class="action">
                <button id="update" data-value="${ excels[i]._id }" title="Cập nhật dữ liệu" class="btn update-btn btn-link"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteRow('${ excels[i]._id }');" title="Xoá" class="btn delete-btn btn-link"><i class="fa-solid fa-trash"></i></button>
            </td>
            <td class="website"><a href=${ excels[i].website_link } target="_blank" >${ excels[i].website }</a></td>
            <td class="position">${ excels[i].position }</td>
            <td class="dimensions new-line">${ excels[i].dimensions }</td>
            <td class="platform">${ excels[i].platform }</td>

            ${ setDemoHTML }

            <td class="buying_method new-line">${ excels[i].buying_method }</td>
            <td class="homepage">${ excels[i].homepage ? numterToString(excels[i].homepage) : "" }</td>
            <td class="cross_site_roadblock">${ excels[i].xuyentrang ? numterToString(excels[i].xuyentrang) : "" }</td>
            <td class="ctr">${ excels[i].chuyenmuc ? numterToString(excels[i].chuyenmuc) : "" }</td>
            <td class="est">${ excels[i].est }</td>
        </tr>
        `;

        $(`#table_${ excels[0].type } tbody`).append(row);
    }

}

async function showData4(excels) {
    var headerTableHTML1 = `
        <tr class="header-table" id="header_table_4">
            <th class="action">Action</th>
            <th class="website1">Website</th>
            <th class="position">Vị trí</th>
            <th class="dimensions1">Kích thước</th>
            <th class="platform">Nền tảng</th>
            <th class="demo1">Demo</th>
            <th class="buying_method">Cách tính giá</th>
            <th class="homepage">Trang chủ</th>
            <th class="cross_site_roadblock">Roadblock xuyên site</th>
            <th class="ctr">Average CTR (%)</th>
            <th class="est">Est. </th>
        </tr>
    `;

    var theadElement = document.querySelector(`#table_${ excels[0].type } thead`);
    theadElement.innerHTML = headerTableHTML1;

    var currentWebsite = "";
    var dataLength = excels.length;

    for (let i = 0; i < dataLength; i++) {

        if (excels[i].website != currentWebsite) {   
            currentWebsite = excels[i].website;
            var headerWebsiteHTML = `
                <tr class="header-website" id="header_table_${ excels[i].website }" title="${ excels[i].website_link }">
                    <th colspan="11"><a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website.toUpperCase() }</a></th>
                </tr>
            `;
            $(`#table_${ excels[0].type } tbody`).append(headerWebsiteHTML);
        }

        var setDemo = "";
        for (let j = 0; j < excels[i].demo.length; j++) { 
            setDemo += `<div class="demo-item">
                <a href="${ excels[i].demo_link[j] }" target="_blank" >${ excels[i].demo[j] }</a> 
            </div>`;
        }
        var setDemoHTML = ``;
        setDemoHTML = `<td class="demo"><div>${ setDemo }</div></td>`;

        var row = `` 
        row += `
        <tr class="row-table" id='${ excels[i]._id }'>
            <td class="action">
                <button id="update" data-value="${ excels[i]._id }" title="Cập nhật dữ liệu" class="btn update-btn btn-link"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteRow('${ excels[i]._id }');" title="Xoá" class="btn delete-btn btn-link"><i class="fa-solid fa-trash"></i></button>
            </td>
            <td class="website"><a href=${ excels[i].website_link } target="_blank" >${ excels[i].website }</a></td>
            <td class="position">${ excels[i].position }</td>
            <td class="dimensions new-line">${ excels[i].dimensions }</td>
            <td class="platform">${ excels[i].platform }</td>

            ${ setDemoHTML }

            <td class="buying_method new-line">${ excels[i].buying_method }</td>
            <td class="homepage">${ excels[i].homepage ? numterToString(excels[i].homepage) : "" }</td>
            <td class="cross_site_roadblock">${ excels[i].cross_site_roadblock }</td>
            <td class="ctr">${ excels[i].ctr ? numterToString(excels[i].ctr) : ""}</td>
            <td class="est">${ excels[i].est }</td>
        </tr>
        `;
        $(`#table_${ excels[0].type } tbody`).append(row);
    }

}

async function showData5(excels) {
    var headerTableHTML1 = `
        <tr class="header-table" id="header_table_5">
            <th class="action">Action</th>
            <th class="website1">Website</th>
            <th class="position">Vị trí</th>
            <th class="dimensions1">Kích thước</th>
            <th class="platform">Nền tảng</th>
            <th class="demo1">Demo</th>
            <th class="buying_method">Tuần</th>
            <th class="homepage">Tháng</th>
            <th class="cross_site_roadblock">Quý</th>
            <th class="ctr">Average CTR (%)</th>
            <th class="est">Est. </th>
        </tr>
    `;

    var theadElement = document.querySelector(`#table_${ excels[0].type } thead`);
    theadElement.innerHTML = headerTableHTML1;

    var currentWebsite = "";
    var dataLength = excels.length;

    for (let i = 0; i < dataLength; i++) {

        if (excels[i].website != currentWebsite) {   
            currentWebsite = excels[i].website;
            var headerWebsiteHTML = `
                <tr class="header-website" id="header_table_${ excels[i].website }" title="${ excels[i].website_link }">
                    <th colspan="11"><a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website.toUpperCase() }</a></th>
                </tr>
            `;
            $(`#table_${ excels[0].type } tbody`).append(headerWebsiteHTML);
        }

        var setDemo = "";
        for (let j = 0; j < excels[i].demo.length; j++) { 
            setDemo += `<div class="demo-item">
                <a href="${ excels[i].demo_link[j] }" target="_blank" >${ excels[i].demo[j] }</a> 
            </div>`;
        }
        var setDemoHTML = ``;
        setDemoHTML = `<td class="demo"><div>${ setDemo }</div></td>`;

        var row = `` 
        row += `
        <tr class="row-table" id='${ excels[i]._id }'>
            <td class="action">
                <button id="update" data-value="${ excels[i]._id }" title="Cập nhật dữ liệu" class="btn update-btn btn-link"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteRow('${ excels[i]._id }');" title="Xoá" class="btn delete-btn btn-link"><i class="fa-solid fa-trash"></i></button>
            </td>
            <td class="website"><a href=${ excels[i].website_link } target="_blank" >${ excels[i].website }</a></td>
            <td class="position">${ excels[i].position }</td>
            <td class="dimensions new-line">${ excels[i].dimensions }</td>
            <td class="platform">${ excels[i].platform }</td>

            ${ setDemoHTML }

            <td class="buying_method new-line">${ excels[i].week ? numterToString(excels[i].week) : "" }</td>
            <td class="homepage">${ excels[i].month ? numterToString(excels[i].month) : "" }</td>
            <td class="cross_site_roadblock">${ excels[i].quarter ? numterToString(excels[i].quarter) : "" }</td>
            <td class="ctr">${ excels[i].ctr ? numterToString(excels[i].ctr) : ""}</td>
            <td class="est">${ excels[i].est }</td>
        </tr>
        `;
        $(`#table_${ excels[0].type } tbody`).append(row);
    }

}


// Hàm ẩn tất cả các khối
function hideAllBlocks() {
    for (var key in blockStates) {
        if (blockStates.hasOwnProperty(key) && blockStates[key] === true) {
            console.log("Hide Block", key);
            // Ẩn khối
            // Ví dụ: document.getElementById(key).style.display = "none";
            blockStates[key] = false;
        }
    }
}

function getTypeFromWebsite(website, array) {
    // Duyệt qua mảng để tìm kiếm website và lấy giá trị type
    for (var i = 0; i < array.length; i++) {
        if (array[i].website === website) {
            return array[i].type;
        }
    }
    // Nếu không tìm thấy, trả về null hoặc giá trị mặc định khác
    return null; // hoặc trả về một giá trị mặc định khác tùy theo yêu cầu của bạn
}

function getWeblinkFromWebsite(website, array) {
    // Duyệt qua mảng để tìm kiếm website và lấy giá trị type
    for (var i = 0; i < array.length; i++) {
        if (array[i].website === website) {
            return array[i].website_link;
        }
    }
    // Nếu không tìm thấy, trả về null hoặc giá trị mặc định khác
    return null; // hoặc trả về một giá trị mặc định khác tùy theo yêu cầu của bạn
}

function getNoFromWebsite(website, array) {
    // Duyệt qua mảng để tìm kiếm website và lấy giá trị type
    for (var i = 0; i < array.length; i++) {
        if (array[i].website === website) {
            return array[i].no;
        }
    }
    // Nếu không tìm thấy, trả về null hoặc giá trị mặc định khác
    return null; // hoặc trả về một giá trị mặc định khác tùy theo yêu cầu của bạn
}

function getIdFromWebsite(website, array) {
    // Duyệt qua mảng để tìm kiếm website và lấy giá trị type
    for (var i = 0; i < array.length; i++) {
        if (array[i].website === website) {
            return array[i]._id;
        }
    }
    // Nếu không tìm thấy, trả về null hoặc giá trị mặc định khác
    return null; // hoặc trả về một giá trị mặc định khác tùy theo yêu cầu của bạn
}

function numterToString (num) {
    if (typeof(num) == 'number' || num.includes('000')) {
        return num.toString().replace(/[,. ]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return num
}

async function deleteRow(idRow) {
    if(confirm("confirm delete")){
        fetch(`http://localhost:3000/api/row`, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ idRow: idRow })
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Network response not ok!");
            }
            return response.json();
        })
        .then(result =>{
            $(`#${idRow}`).remove();
            console.log(result);

            alert("Deleted");
        })
    }
}

function creatNewRow (newRow) {
    // console.log("token",token);
    fetch('http://localhost:3000/api/row', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorize" : token
        },
        body:JSON.stringify(newRow)
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

        setTimeout(function() {
            window.location.href = 'http://localhost:3000/admin';
        }, 500);
    
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });

}

function updateRow (updateRow) {
    console.log("UPDATE");

    fetch('http://localhost:3000/api/row', {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json",
            "Authorize" : token
        },
        body:JSON.stringify(updateRow)
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

        setTimeout(function() {
            window.location.href = 'http://localhost:3000/admin';
        }, 500);
    
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
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