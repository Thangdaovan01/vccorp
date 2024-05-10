var styles = [];
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
        console.log("RÉUKLT",styles[1]);
        // search();
        showData(styles);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
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

    for (let i = 0; i < dataLength; i++) {
        if (excels[i].website != currentWebsite) {   
            currentWebsite = excels[i].website;
            var headerWebsiteHTML = `
                <tr class="header-website" id="header_table_${ excels[i].website }" title="${ excels[i].website_link }">
                    <th colspan="10"><a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website.toUpperCase() }</a></th>
                </tr>
            `;
            $(`#table_${ excels[0].type } tbody`).append(headerWebsiteHTML);
        }

        // merge website
        while(i + rowspanWebsite < excels.length && excels[i + rowspanWebsite].website == excels[i].website) {
            rowspanWebsite ++;
        }

        var setWebsiteHTML = ``
        if (excels[i-1] && excels[i-1].website == excels[i].website) {
            setWebsiteHTML =  ``;
        } else {
            setWebsiteHTML = `<td class="website" rowspan="${ rowspanWebsite }" title="${ excels[i].website_link }">
                                <a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website }</a>
                            </td>`;
        }
        rowspanWebsite = 0;
        

        // merge adsPosition and dimensions
        while(i + rowspanPosition < excels.length && excels[i + rowspanPosition].position == excels[i].position && excels[i + rowspanPosition].dimensions == excels[i].dimensions && excels[i + rowspanPosition].website == excels[i].website) {
            rowspanPosition ++;
        }
        var setPositionDimensionsHTML = ``;
        if (excels[i-1] && excels[i-1].position == excels[i].position && excels[i-1].dimensions == excels[i].dimensions && excels[i-1].website == excels[i].website) {
            setPositionDimensionsHTML =  ``;
        } else {
            setPositionDimensionsHTML = `<td class="position" rowspan="${ rowspanPosition }">${ excels[i].position }</td>
                                        <td class="dimensions new-line" rowspan="${ rowspanPosition }">${ excels[i].dimensions }</td>`;
        }
        rowspanPosition = 0;

        // merge platform
        while(i + rowspanPlatform < excels.length && excels[i + rowspanPlatform].platform == excels[i].platform && excels[i + rowspanPlatform].website == excels[i].website) {
            rowspanPlatform ++;
        }

        var setPlatformHTML = ``;

        if (excels[i-1] && excels[i-1].platform == excels[i].platform && excels[i-1].website == excels[i].website) {
            setPlatformHTML =  ``;
        } else {
            setPlatformHTML = `<td class="platform" rowspan="${ rowspanPlatform }">${ excels[i].platform }</td>`;
        }
        rowspanPlatform = 0;


        // merge demo
        var setDemo = "";
        for (let j = 0; j < excels[i].demo.length; j++) { 
            setDemo += `<div class="demo-item">
                <a href="${ excels[i].demo_link[j] }" target="_blank" >${ excels[i].demo[j] }</a> 
            </div>`;
        }
        
        while(i + rowspanDemo < excels.length && JSON.stringify(excels[i + rowspanDemo].demo_link) === JSON.stringify(excels[i].demo_link) && excels[i + rowspanDemo].website == excels[i].website) {
            rowspanDemo ++;
        }

        var setDemoHTML = ``;
        if (excels[i-1] && JSON.stringify(excels[i - 1].demo_link) === JSON.stringify(excels[i].demo_link) && excels[i-1].website == excels[i].website) {
            setDemoHTML =  ``;
        } else {
            setDemoHTML = `<td class="demo" rowspan="${ rowspanDemo }"><div>${ setDemo }</div></td>`;
        }
        rowspanDemo = 0;

        var row = `
        <tr class="row-table">
            
            ${ setWebsiteHTML }
            ${ setPositionDimensionsHTML }
            ${ setPlatformHTML }
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

async function showData2(excels) {
    var headerTableHTML1 = `
        <tr class="header-table" id="header_table_2">
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
    var rowspanWebsite = 0, rowspanPosition = 0, rowspanPlatform = 0, rowspanDemo = 0;
    var dataLength = excels.length;

    for (let i = 0; i < dataLength; i++) {
        if (excels[i].website != currentWebsite) {   
            currentWebsite = excels[i].website;
            var headerWebsiteHTML = `
                <tr class="header-website" id="header_table_${ excels[i].website }" title="${ excels[i].website_link }">
                    <th colspan="10"><a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website.toUpperCase() }</a></th>
                </tr>
            `;
            $(`#table_${ excels[0].type } tbody`).append(headerWebsiteHTML);
        }

        // merge website
        while(i + rowspanWebsite < excels.length && excels[i + rowspanWebsite].website == excels[i].website) {
            rowspanWebsite ++;
        }

        var setWebsiteHTML = ``
        if (excels[i-1] && excels[i-1].website == excels[i].website) {
            setWebsiteHTML =  ``;
        } else {
            setWebsiteHTML = `<td class="website" rowspan="${ rowspanWebsite }" title="${ excels[i].website_link }">
                                <a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website }</a>
                            </td>`;
        }
        rowspanWebsite = 0;
        

        // merge adsPosition and dimensions
        while(i + rowspanPosition < excels.length && excels[i + rowspanPosition].position == excels[i].position && excels[i + rowspanPosition].dimensions == excels[i].dimensions && excels[i + rowspanPosition].website == excels[i].website) {
            rowspanPosition ++;
        }
        var setPositionDimensionsHTML = ``;
        if (excels[i-1] && excels[i-1].position == excels[i].position && excels[i-1].dimensions == excels[i].dimensions && excels[i-1].website == excels[i].website) {
            setPositionDimensionsHTML =  ``;
        } else {
            setPositionDimensionsHTML = `<td class="position" rowspan="${ rowspanPosition }">${ excels[i].position }</td>
                                        <td class="dimensions new-line" rowspan="${ rowspanPosition }">${ excels[i].dimensions }</td>`;
        }
        rowspanPosition = 0;

        // merge platform
        while(i + rowspanPlatform < excels.length && excels[i + rowspanPlatform].platform == excels[i].platform && excels[i + rowspanPlatform].website == excels[i].website) {
            rowspanPlatform ++;
        }

        var setPlatformHTML = ``;

        if (excels[i-1] && excels[i-1].platform == excels[i].platform && excels[i-1].website == excels[i].website) {
            setPlatformHTML =  ``;
        } else {
            setPlatformHTML = `<td class="platform" rowspan="${ rowspanPlatform }">${ excels[i].platform }</td>`;
        }
        rowspanPlatform = 0;


        // merge demo
        var setDemo = "";
        for (let j = 0; j < excels[i].demo.length; j++) { 
            setDemo += `<div class="demo-item">
                <a href="${ excels[i].demo_link[j] }" target="_blank" >${ excels[i].demo[j] }</a> 
            </div>`;
        }
        
        while(i + rowspanDemo < excels.length && JSON.stringify(excels[i + rowspanDemo].demo_link) === JSON.stringify(excels[i].demo_link) && excels[i + rowspanDemo].website == excels[i].website) {
            rowspanDemo ++;
        }

        var setDemoHTML = ``;
        if (excels[i-1] && JSON.stringify(excels[i - 1].demo_link) === JSON.stringify(excels[i].demo_link) && excels[i-1].website == excels[i].website) {
            setDemoHTML =  ``;
        } else {
            setDemoHTML = `<td class="demo" rowspan="${ rowspanDemo }"><div>${ setDemo }</div></td>`;
        }
        rowspanDemo = 0;

        var row = `
        <tr class="row-table">
            
            ${ setWebsiteHTML }
            ${ setPositionDimensionsHTML }
            ${ setPlatformHTML }
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
    var rowspanWebsite = 0, rowspanPosition = 0, rowspanPlatform = 0, rowspanDemo = 0;
    var dataLength = excels.length;

    for (let i = 0; i < dataLength; i++) {
        if (excels[i].website != currentWebsite) {   
            currentWebsite = excels[i].website;
            var headerWebsiteHTML = `
                <tr class="header-website" id="header_table_${ excels[i].website }" title="${ excels[i].website_link }">
                    <th colspan="10"><a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website.toUpperCase() }</a></th>
                </tr>
            `;
            $(`#table_${ excels[0].type } tbody`).append(headerWebsiteHTML);
        }

        // merge website
        while(i + rowspanWebsite < excels.length && excels[i + rowspanWebsite].website == excels[i].website) {
            rowspanWebsite ++;
        }

        var setWebsiteHTML = ``
        if (excels[i-1] && excels[i-1].website == excels[i].website) {
            setWebsiteHTML =  ``;
        } else {
            setWebsiteHTML = `<td class="website" rowspan="${ rowspanWebsite }" title="${ excels[i].website_link }">
                                <a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website }</a>
                            </td>`;
        }
        rowspanWebsite = 0;
        

        // merge adsPosition and dimensions
        while(i + rowspanPosition < excels.length && excels[i + rowspanPosition].position == excels[i].position && excels[i + rowspanPosition].dimensions == excels[i].dimensions && excels[i + rowspanPosition].website == excels[i].website) {
            rowspanPosition ++;
        }
        var setPositionDimensionsHTML = ``;
        if (excels[i-1] && excels[i-1].position == excels[i].position && excels[i-1].dimensions == excels[i].dimensions && excels[i-1].website == excels[i].website) {
            setPositionDimensionsHTML =  ``;
        } else {
            setPositionDimensionsHTML = `<td class="position" rowspan="${ rowspanPosition }">${ excels[i].position }</td>
                                        <td class="dimensions new-line" rowspan="${ rowspanPosition }">${ excels[i].dimensions }</td>`;
        }
        rowspanPosition = 0;

        // merge platform
        while(i + rowspanPlatform < excels.length && excels[i + rowspanPlatform].platform == excels[i].platform && excels[i + rowspanPlatform].website == excels[i].website) {
            rowspanPlatform ++;
        }

        var setPlatformHTML = ``;

        if (excels[i-1] && excels[i-1].platform == excels[i].platform && excels[i-1].website == excels[i].website) {
            setPlatformHTML =  ``;
        } else {
            setPlatformHTML = `<td class="platform" rowspan="${ rowspanPlatform }">${ excels[i].platform }</td>`;
        }
        rowspanPlatform = 0;


        // merge demo
        var setDemo = "";
        for (let j = 0; j < excels[i].demo.length; j++) { 
            setDemo += `<div class="demo-item">
                <a href="${ excels[i].demo_link[j] }" target="_blank" >${ excels[i].demo[j] }</a> 
            </div>`;
        }
        
        while(i + rowspanDemo < excels.length && JSON.stringify(excels[i + rowspanDemo].demo_link) === JSON.stringify(excels[i].demo_link) && excels[i + rowspanDemo].website == excels[i].website) {
            rowspanDemo ++;
        }

        var setDemoHTML = ``;
        if (excels[i-1] && JSON.stringify(excels[i - 1].demo_link) === JSON.stringify(excels[i].demo_link) && excels[i-1].website == excels[i].website) {
            setDemoHTML =  ``;
        } else {
            setDemoHTML = `<td class="demo" rowspan="${ rowspanDemo }"><div>${ setDemo }</div></td>`;
        }
        rowspanDemo = 0;

        var row = `
        <tr class="row-table">
            
            ${ setWebsiteHTML }
            ${ setPositionDimensionsHTML }
            ${ setPlatformHTML }
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
    var rowspanWebsite = 0, rowspanPosition = 0, rowspanPlatform = 0, rowspanDemo = 0;
    var dataLength = excels.length;

    for (let i = 0; i < dataLength; i++) {
        if (excels[i].website != currentWebsite) {   
            currentWebsite = excels[i].website;
            var headerWebsiteHTML = `
                <tr class="header-website" id="header_table_${ excels[i].website }" title="${ excels[i].website_link }">
                    <th colspan="10"><a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website.toUpperCase() }</a></th>
                </tr>
            `;
            $(`#table_${ excels[0].type } tbody`).append(headerWebsiteHTML);
        }

        // merge website
        while(i + rowspanWebsite < excels.length && excels[i + rowspanWebsite].website == excels[i].website) {
            rowspanWebsite ++;
        }

        var setWebsiteHTML = ``
        if (excels[i-1] && excels[i-1].website == excels[i].website) {
            setWebsiteHTML =  ``;
        } else {
            setWebsiteHTML = `<td class="website" rowspan="${ rowspanWebsite }" title="${ excels[i].website_link }">
                                <a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website }</a>
                            </td>`;
        }
        rowspanWebsite = 0;
        

        // merge adsPosition and dimensions
        while(i + rowspanPosition < excels.length && excels[i + rowspanPosition].position == excels[i].position && excels[i + rowspanPosition].dimensions == excels[i].dimensions && excels[i + rowspanPosition].website == excels[i].website) {
            rowspanPosition ++;
        }
        var setPositionDimensionsHTML = ``;
        if (excels[i-1] && excels[i-1].position == excels[i].position && excels[i-1].dimensions == excels[i].dimensions && excels[i-1].website == excels[i].website) {
            setPositionDimensionsHTML =  ``;
        } else {
            setPositionDimensionsHTML = `<td class="position" rowspan="${ rowspanPosition }">${ excels[i].position }</td>
                                        <td class="dimensions new-line" rowspan="${ rowspanPosition }">${ excels[i].dimensions }</td>`;
        }
        rowspanPosition = 0;

        // merge platform
        while(i + rowspanPlatform < excels.length && excels[i + rowspanPlatform].platform == excels[i].platform && excels[i + rowspanPlatform].website == excels[i].website) {
            rowspanPlatform ++;
        }

        var setPlatformHTML = ``;

        if (excels[i-1] && excels[i-1].platform == excels[i].platform && excels[i-1].website == excels[i].website) {
            setPlatformHTML =  ``;
        } else {
            setPlatformHTML = `<td class="platform" rowspan="${ rowspanPlatform }">${ excels[i].platform }</td>`;
        }
        rowspanPlatform = 0;


        // merge demo
        var setDemo = "";
        for (let j = 0; j < excels[i].demo.length; j++) { 
            setDemo += `<div class="demo-item">
                <a href="${ excels[i].demo_link[j] }" target="_blank" >${ excels[i].demo[j] }</a> 
            </div>`;
        }
        
        while(i + rowspanDemo < excels.length && JSON.stringify(excels[i + rowspanDemo].demo_link) === JSON.stringify(excels[i].demo_link) && excels[i + rowspanDemo].website == excels[i].website) {
            rowspanDemo ++;
        }

        var setDemoHTML = ``;
        if (excels[i-1] && JSON.stringify(excels[i - 1].demo_link) === JSON.stringify(excels[i].demo_link) && excels[i-1].website == excels[i].website) {
            setDemoHTML =  ``;
        } else {
            setDemoHTML = `<td class="demo" rowspan="${ rowspanDemo }"><div>${ setDemo }</div></td>`;
        }
        rowspanDemo = 0;

        var row = `
        <tr class="row-table">
            
            ${ setWebsiteHTML }
            ${ setPositionDimensionsHTML }
            ${ setPlatformHTML }
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
    var rowspanWebsite = 0, rowspanPosition = 0, rowspanPlatform = 0, rowspanDemo = 0;
    var dataLength = excels.length;

    for (let i = 0; i < dataLength; i++) {
        if (excels[i].website != currentWebsite) {   
            currentWebsite = excels[i].website;
            var headerWebsiteHTML = `
                <tr class="header-website" id="header_table_${ excels[i].website }" title="${ excels[i].website_link }">
                    <th colspan="10"><a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website.toUpperCase() }</a></th>
                </tr>
            `;
            $(`#table_${ excels[0].type } tbody`).append(headerWebsiteHTML);
        }

        // merge website
        while(i + rowspanWebsite < excels.length && excels[i + rowspanWebsite].website == excels[i].website) {
            rowspanWebsite ++;
        }

        var setWebsiteHTML = ``
        if (excels[i-1] && excels[i-1].website == excels[i].website) {
            setWebsiteHTML =  ``;
        } else {
            setWebsiteHTML = `<td class="website" rowspan="${ rowspanWebsite }" title="${ excels[i].website_link }">
                                <a href="${ excels[i].website_link }" target="_blank" rel="noopener noreferrer">${ excels[i].website }</a>
                            </td>`;
        }
        rowspanWebsite = 0;
        

        // merge adsPosition and dimensions
        while(i + rowspanPosition < excels.length && excels[i + rowspanPosition].position == excels[i].position && excels[i + rowspanPosition].dimensions == excels[i].dimensions && excels[i + rowspanPosition].website == excels[i].website) {
            rowspanPosition ++;
        }
        var setPositionDimensionsHTML = ``;
        if (excels[i-1] && excels[i-1].position == excels[i].position && excels[i-1].dimensions == excels[i].dimensions && excels[i-1].website == excels[i].website) {
            setPositionDimensionsHTML =  ``;
        } else {
            setPositionDimensionsHTML = `<td class="position" rowspan="${ rowspanPosition }">${ excels[i].position }</td>
                                        <td class="dimensions new-line" rowspan="${ rowspanPosition }">${ excels[i].dimensions }</td>`;
        }
        rowspanPosition = 0;

        // merge platform
        while(i + rowspanPlatform < excels.length && excels[i + rowspanPlatform].platform == excels[i].platform && excels[i + rowspanPlatform].website == excels[i].website) {
            rowspanPlatform ++;
        }

        var setPlatformHTML = ``;

        if (excels[i-1] && excels[i-1].platform == excels[i].platform && excels[i-1].website == excels[i].website) {
            setPlatformHTML =  ``;
        } else {
            setPlatformHTML = `<td class="platform" rowspan="${ rowspanPlatform }">${ excels[i].platform }</td>`;
        }
        rowspanPlatform = 0;


        // merge demo
        var setDemo = "";
        for (let j = 0; j < excels[i].demo.length; j++) { 
            setDemo += `<div class="demo-item">
                <a href="${ excels[i].demo_link[j] }" target="_blank" >${ excels[i].demo[j] }</a> 
            </div>`;
        }
        
        while(i + rowspanDemo < excels.length && JSON.stringify(excels[i + rowspanDemo].demo_link) === JSON.stringify(excels[i].demo_link) && excels[i + rowspanDemo].website == excels[i].website) {
            rowspanDemo ++;
        }

        var setDemoHTML = ``;
        if (excels[i-1] && JSON.stringify(excels[i - 1].demo_link) === JSON.stringify(excels[i].demo_link) && excels[i-1].website == excels[i].website) {
            setDemoHTML =  ``;
        } else {
            setDemoHTML = `<td class="demo" rowspan="${ rowspanDemo }"><div>${ setDemo }</div></td>`;
        }
        rowspanDemo = 0;

        var row = `
        <tr class="row-table">
            
            ${ setWebsiteHTML }
            ${ setPositionDimensionsHTML }
            ${ setPlatformHTML }
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

function numterToString (num) {
    if (typeof(num) == 'number' || num.includes('000')) {
        return num.toString().replace(/[,. ]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return num
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
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