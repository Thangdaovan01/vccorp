// const jwt = require('jsonwebtoken');
const { decodeToken } = require('./authentication.js');
const User = require('../models/User')


        // const token = req.header('Authorize');
const checkAdminRole = async  (req, res, next) => {
    const token = req.header('Authorize');
    console.log("token",token)

    if (!token) {
        return res.status(401).json({ message: "Truy cập bị từ chối. Không có token được cung cấp." });
    }
    // Giải mã token
    const decoded = decodeToken(token);
    if (!decoded) {
        return res.status(401).json({ message: "Token không hợp lệ." });
    }
    console.log("decoded",decoded);
    const existingUser = await User.findOne({ user_name: decoded.user_name });
    console.log("existingUser",existingUser);

        if (!existingUser) {
            return res.status(400).json({ message: 'Username không tồn tại trong hệ thống' }); // user_name đã tồn tại
        } else {
            if(existingUser.role == "admin") {
                next();
            } else {
                return res.status(400).json({ message: 'Bạn không có quyền thựuc hiện'});
            }
        }
    // if (req.user.role !== 'admin') {
    //     return res.status(403).send('Access denied');
    // }
    // next();
}

// module.exports = { checkAdminRole };
module.exports = checkAdminRole;