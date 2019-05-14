const request = require('request')
const fs = require('fs')

console.log('loading words.txt...')
var wordsRaw = fs.readFileSync('words.txt').toString()
const words = wordsRaw.split('\n')
delete wordsRaw
console.log('words.txt loaded')

console.log('getting a post...')
request('https://reddit.com/r/AskOuija/random.json', { json: true }, (err, res, body) => {
    if (err) { return console.log(err) }
    const data = body[0].data.children[0].data
    console.log('found one:')
    console.log(data.url)
    const title = data.title
    console.log(title)
    if (/_+/.test(title)) {
        console.log('title contains underscores')
        const word = words[Math.floor(Math.random() * (words.length - 1)) + 1];
        console.log('inserting', word)
        console.log(title.replace(/_+/, word))
    }
    else {
        console.log('title doesn\'t contain underscores')
        const word = words[Math.floor(Math.random() * (words.length - 1)) + 1];
        console.log('AnswerOuija says:', word)
    }
})
