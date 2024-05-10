const express = require('express');
// const pool = require('../config/connectDB');

const getLoginPage = async (req, res) => {
    try {
        return res.status(200).render('login');
    } catch (error) {
        console.error(error);
        return res.status(404).json('Server error');
    }
}
  
const getHomepage = async (req, res) => {
    try {
        return res.status(200).render('index');
    } catch (error) {
        console.error(error);
        return res.status(404).json('Server error');
    }
}

const getAdminPage = async (req, res) => {
    try {
        return res.status(200).render('admin/homepage');
    } catch (error) {
        console.error(error);
        return res.status(404).json('Server error');
    }
}

module.exports = {
    getLoginPage, getHomepage,
    getAdminPage
}