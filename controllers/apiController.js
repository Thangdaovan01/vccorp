const express = require('express');
const { generateToken, decodeToken } = require('../middleware/authentication');
const User = require('../models/User')
const style = [];

const login = async (req, res) => {
    try {
        const account = req.body;
        console.log("Account",account);

        if (!account.user_name || !account.password) {
            return res.status(400).json({ message: 'Account không nhận được ở phía Server' })
        }

        checkUsernameExists(account.user_name)
            .then(usernameExist => {
                if (!usernameExist) {
                    return res.status(400).json({ message: 'Username không tồn tại trong hệ thống' });
                } else {
                    // Email tồn tại, kiểm tra mật khẩu
                    return User.findOne({ user_name: account.user_name });
                }
            })
            .then(user => {
                // Kiểm tra mật khẩu
                console.log("User",user);
                console.log("Pasword",account.password);
                if(user.password !== account.password) {
                    return res.status(400).json({ message: 'Mật khẩu không đúng' });
                } else {
                    // Mật khẩu khớp, tiếp tục xử lý đăng nhập
                    return res.status(200).json({ message: 'Đăng nhập thành công' });
                }
            })
            
            .catch(err => {
                // Xảy ra lỗi trong quá trình xử lý
                return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý' });
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const register = async (req, res) => {
    try {
        const account = req.body;
        if (!account.fullname || !account.user_name || !account.password) {
            return res.status(400).json({ message: 'Thông tin tài khoản đăng kí không được gửi đầy đủ về phía server' });
        }

        const user = new User(account);
        checkUsernameExists(account.user_name)
            .then(usernameExist => {
                if (usernameExist) {
                    return res.status(400).json({ error: 'Tài khoản đã tồn tại' });
                } else {
                    // const token = generateToken(account);
                    user.save()
                        // .lean()
                        .then(() => {
                            return res.status(200).json({ message: 'Đăng kí thành công' });
                        })
                        .catch(error => {
                            console.error(error);
                            return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý 2' });
                        });
                }
            })
            .catch(error => {
                console.error(error);
                return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý 1' });
            });
        
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

//Kiểm tra Username
function checkUsernameExists(user_name) {
    return new Promise((resolve, reject) => {
        User.findOne({ user_name: user_name })
            .then(user => {
                if (user) {
                    resolve(true); // user_name đã tồn tại
                    // return true;
                } else {
                    resolve(false); // user_name chưa tồn tại
                }
            })
            .catch(err => {
                reject(err); // Xảy ra lỗi trong quá trình truy vấn cơ sở dữ liệu
            });
    });
}




module.exports = {
    login, register
}