const express = require('express');
const { generateToken, decodeToken } = require('../middleware/authentication');
const User = require('../models/User')
const Excel = require('../models/Excel')
const style = [];

const login = async (req, res) => {
    try {
        const Website = req.body;

        if (!Website.user_name || !Website.password) {
            return res.status(400).json({ message: 'Website không nhận được ở phía Server' })
        }

        const existingUser = await User.findOne({ user_name: Website.user_name });

        if (!existingUser) {
            return res.status(400).json({ message: 'Username không tồn tại trong hệ thống' }); // user_name đã tồn tại
        } else {
            if(existingUser.password !== Website.password) {
                return res.status(400).json({ message: 'Mật khẩu không đúng' });
            } else {
                const token = generateToken(Website);
                return res.status(200).json({ message: 'Đăng nhập thành công', token: token, role: existingUser.role});
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}
 
const register = async (req, res) => {
    try {
        const Website = req.body;
        if (!Website.fullname || !Website.user_name || !Website.password) {
            return res.status(400).json({ message: 'Thông tin tài khoản đăng kí không được gửi đầy đủ về phía server' });
        }
        const existingUser = await User.findOne({ user_name: Website.user_name });

        if (existingUser) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại' }); // user_name đã tồn tại
        } else {
            const userNew = new User(Website);
            const token = generateToken(Website);

            await userNew.save();
            return res.status(200).json({ message: 'Đăng kí thành công', token: token });
        }
                
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getStyle = async (req, res) => {
    try {
        Excel.find({}) 
        .lean() 
        .then((excels) => {
            return res.status(200).json(excels);
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý 2' });
        }); 
    } catch (error) {
        console.error(error);
        return res.status(404).json('Server error');
    }
}


//Quản lý row
const createRow = async (req, res) => {
    try {
        const newRow = req.body;
        const token = req.header('Authorize');
        console.log("token",token);

        if (!token) {
            return res.status(401).json({ message: 'Không xác thực được danh tính' })
        }

        const checkAcc = decodeToken(token);
        
        const existingUser = await User.findOne({ user_name: checkAcc.user_name });
        // console.log("existingUser", existingUser)


        if (!newRow.website || !newRow.website_link || !newRow.position || !newRow.dimensions || !newRow.platform || !newRow.demo) {
            return res.status(400).json({ message: 'Dữ liệu được gửi về Server không đầy đủ.' })
        }

        newRow.createdBy = existingUser._id;
        newRow.updatedBy = null;

        const excel = new Excel(newRow);
        await excel.save();
        return res.status(200).json({ message: 'Đã thêm dữ liệu mới.' });
        
        // return res.status(200).json({ message: "Đã thêm dữ liệu mới.", idNewRow: result.insertId })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getRow = async (req, res) => {
    
    try {
        const searchValue = req.query.key;
        console.log("searchValue",searchValue);

        if (!searchValue) {
            return res.status(400).json({ message: 'Vui lòng nhập giá trị tìm kiếm'});
        }
        const excels = await Excel.find({
            $or: [
                { website: { $regex: searchValue, $options: 'i' } }, // Tìm theo tiêu đề, không phân biệt hoa thường
                { position: { $regex: searchValue, $options: 'i' } },
                { dimensions: { $regex: searchValue, $options: 'i' } },
                { platform: { $regex: searchValue, $options: 'i' } },
                { buying_method: { $regex: searchValue, $options: 'i' } },
            ]
        });


        console.log("excels",excels);


        if (!excels || !excels.length) {
            return res.status(400).json({ message: 'Không có giá trị cần tìm kiếm'});
        } else {
            return res.status(200).json(excels);
        }
    } catch (error) {
        console.error(error);
        return res.status(404).json('Server error');
    }
}

const updateRow = async (req, res) => {
    try {
        const updateRow = req.body;
        const token = req.header('Authorize');

        if (!token) {
            return res.status(401).json({ message: 'Không xác thực được danh tính' })
        }

        const checkAcc = decodeToken(token);
        
        if (!updateRow.position || !updateRow.dimensions || !updateRow.platform  || !updateRow.demo || !updateRow.demo_link) {
            return res.status(400).json({   message: 'Dữ liệu được gửi về Server không đầy đủ.' })
        }

        const existingUser = await User.findOne({ user_name: checkAcc.user_name });
        // console.log("existingUser", existingUser)
        updateRow.createdBy = null;
        updateRow.updatedBy = existingUser._id;
        console.log(updateRow);

        await Excel.updateOne({ _id: updateRow._id }, updateRow);
        
        return res.status(200).json({ message: 'Cập nhật thành công.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const deleteRow = async (req, res) => {
    try {
        // const idRow = req.body.idRow;
        const idRow = req.body.idRow;
        // console.log(idRow);
        if (!idRow) {
            return res.status(400).json({ message: 'Thông tin về dữ liệu bạn muốn xóa không được gửi về server.'});
        }

        Excel.deleteOne({ _id: idRow })
            .lean()
            .then(() => {return res.status(200).json({message: "Xóa thành công"})}) //Khi thành công thì thực thi
            .catch(error => {
                console.error(error);
                return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi từ phía server' });
    }
}


//Quản lý Website
const createWebsite = async (req, res) => {
    try {
        const newRow = req.body;
        const token = req.header('Authorize');
        console.log("token",token);

        if (!token) {
            return res.status(401).json({ message: 'Không xác thực được danh tính' })
        }

        const checkAcc = decodeToken(token);
        
        const existingUser = await User.findOne({ user_name: checkAcc.user_name });
        // console.log("existingUser", existingUser)


        if (!newRow.website || !newRow.website_link || !newRow.position || !newRow.dimensions || !newRow.platform || !newRow.demo) {
            return res.status(400).json({ message: 'Dữ liệu được gửi về Server không đầy đủ.' })
        }

        newRow.createdBy = existingUser._id;
        newRow.updatedBy = null;

        const excel = new Excel(newRow);
        await excel.save();
        return res.status(200).json({ message: 'Đã thêm dữ liệu mới.' });
        
        // return res.status(200).json({ message: "Đã thêm dữ liệu mới.", idNewRow: result.insertId })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getWebsites = async (req, res) => {
    try {
        const websites = await Excel.find({});
        // console.log("websites",websites);
        // var websiteNames = websites.filter((item, index, array) => array.findIndex(i => i.website === item.website) === index)
        //                      .map(item => item.website);
        const websiteNames = Array.from(
            new Set(websites.map(site => JSON.stringify({ website: site.website, website_link: site.website_link, no: site.no })))
        ).map(str => JSON.parse(str));

        return res.status(200).json(websiteNames);
    } catch (error) {
        console.error(error);
        return res.status(404).json('Server error');
    }
}

const updateWebsite = async (req, res) => {
    try {
        const website = req.body.website;
        console.log(website);
        if (!website) {
            return res.status(400).json({ message: 'Thông tin về dữ liệu bạn muốn xóa không được gửi về server.'});
        }

        var websiteLink = website.website_link;
        var websiteName = website.website;
        var websiteNo = website.no;

        const websites = await Excel.find();
        var isExistWebsite = websites.some(item => item.no == websiteNo);
        var websiteNameBefore = websites.filter(item => item.no == websiteNo).map(item => item.website);
        var websiteLinkBefore = websites.filter(item => item.no == websiteNo).map(item => item.website_link);
        console.log("isExistWebsite",isExistWebsite);
        console.log("websiteNameBefore",websiteNameBefore);
        console.log("websiteLinkBefore",websiteLinkBefore);

        if(!isExistWebsite) {
            return res.status(400).json({ message: 'Website cần xoá không tồn tại.'});
        } else {
            await Excel.updateMany(
                { no: websiteNo},
                { $set: { 
                    "website.$[elem].website": websiteName,
                    "website.$[elem].website_link": websiteLink
                } },
                {
                    arrayFilters: [{"elem.website":websiteNameBefore[0]}, {"elem.website_link":websiteLinkBefore[0]}]
                }
              );
            return res.status(200).json({ message: 'Xoá thành công'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi từ phía server' });
    }
}

const deleteWebsite = async (req, res) => {
    try {
        const website = req.body.website;
        console.log(website);
        if (!website) {
            return res.status(400).json({ message: 'Thông tin về dữ liệu bạn muốn xóa không được gửi về server.'});
        }

        var websiteLink = website.website_link;
        var websiteName = website.website;

        const websites = await Excel.find();
        var isExistWebsite = websites.some(item => item.website == websiteName && item.website_link == websiteLink);

        if(!isExistWebsite) {
            return res.status(400).json({ message: 'Website cần xoá không tồn tại.'});
        } else {
            // await User.deleteOne({_id: userId});
            await Excel.deleteMany(
                { website: websiteName, website_link: websiteLink }
              );
            return res.status(200).json({ message: 'Xoá thành công'});

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi từ phía server' });
    }
}


//Quản lí tài khoản

const getAccounts = async (req, res) => {
    try {
        const accounts = await User.find({});
        return res.status(200).json(accounts);
    } catch (error) {
        console.error(error);
        return res.status(404).json('Server error');
    }
}

const getAccount = async (req, res) => {
    
    try {
        const searchValue = req.query.key;
        console.log("searchValue",searchValue);

        if (!searchValue) {
            return res.status(400).json({ message: 'Vui lòng nhập giá trị tìm kiếm'});
        }
        const excels = await Excel.find({
            $or: [
                { website: { $regex: searchValue, $options: 'i' } }, // Tìm theo tiêu đề, không phân biệt hoa thường
                { position: { $regex: searchValue, $options: 'i' } },
                { dimensions: { $regex: searchValue, $options: 'i' } },
                { platform: { $regex: searchValue, $options: 'i' } },
                { buying_method: { $regex: searchValue, $options: 'i' } },
            ]
        });


        console.log("excels",excels);


        if (!excels || !excels.length) {
            return res.status(400).json({ message: 'Không có giá trị cần tìm kiếm'});
        } else {
            return res.status(200).json(excels);
        }
    } catch (error) {
        console.error(error);
        return res.status(404).json('Server error');
    }
}

const updateAccount = async (req, res) => {
    try {
        const updateRow = req.body;
        const token = req.header('Authorize');

        if (!token) {
            return res.status(401).json({ message: 'Không xác thực được danh tính' })
        }

        const checkAcc = decodeToken(token);
        
        if (!updateRow.position || !updateRow.dimensions || !updateRow.platform  || !updateRow.demo || !updateRow.demo_link) {
            return res.status(400).json({   message: 'Dữ liệu được gửi về Server không đầy đủ.' })
        }

        const existingUser = await User.findOne({ user_name: checkAcc.user_name });
        // console.log("existingUser", existingUser)
        updateRow.createdBy = null;
        updateRow.updatedBy = existingUser._id;
        console.log(updateRow);

        await Excel.updateOne({ _id: updateRow._id }, updateRow);
        
        return res.status(200).json({ message: 'Cập nhật thành công.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log(userId);
        if (!userId) {
            return res.status(400).json({ message: 'Thông tin về dữ liệu bạn muốn xóa không được gửi về server.'});
        }

        const users = await User.findById(userId);

        if(!users) {
            return res.status(400).json({ message: 'Tài khoản cần xoá không tồn tại.'});
        } else {
            await User.deleteOne({_id: userId});
            return res.status(200).json({ message: 'Xoá thành công'});

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi từ phía server' });
    }
}


function getIdFromtUsername(username, array) {
    // Duyệt qua mảng để tìm kiếm website và lấy giá trị type
    for (var i = 0; i < array.length; i++) {
        if (array[i].user_name === username) {
            return array[i]._id;
        }
    }
    // Nếu không tìm thấy, trả về null hoặc giá trị mặc định khác
    return null; // hoặc trả về một giá trị mặc định khác tùy theo yêu cầu của bạn
}

module.exports = {
    login, register,
    getStyle, 
    deleteRow, createRow, updateRow, getRow,
    deleteAccount, updateAccount, getAccounts, getAccount,
    deleteWebsite, updateWebsite, getWebsites

}