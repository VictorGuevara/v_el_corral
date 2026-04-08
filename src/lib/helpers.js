const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const final_pass = await bcrypt.hash(password, salt);
    return final_pass;
};

helpers.mathPassword = async (password, savePassword) => {
    try {
        return await bcrypt.compare(password, savePassword);        
    } catch (error) {
        console.log(error);
    };
};

module.exports = helpers;