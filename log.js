const fs = require('fs')

/**
 * Replace console.log with log and everything will be logged to log.txt
 * @param  {...string} message The messages to log
 */
module.exports = function (...message) {
    console.log(...message)
    fs.appendFile('log.txt', message.join(' ') + '\n', err => {
        if (err) throw err
    })
}