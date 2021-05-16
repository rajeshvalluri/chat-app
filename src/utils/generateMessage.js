const get_time = require('../utils/gettime')

const generateMessage = (username,text) => {
    return {
        username,
        text,
        createdAt : get_time()
    }
}
module.exports = {
    generateMessage
}