const log = require('./log')
const Snooper = require('reddit-snooper')
const fs = require('fs')

log('loading config.json...')
const config = JSON.parse(fs.readFileSync('config.json'))
log('config.json loaded')

const snooper = new Snooper(
    {
        // credential information is not needed for snooper.watcher
        username: config.username,
        password: config.password,
        app_id: config.app_id,
        api_secret: config.app_secret,
        user_agent: config.user_agent,
        automatic_retries: true, // automatically handles condition when reddit says 'you are doing this too much'
        api_requests_per_minuite: 60 // api requests will be spread out in order to play nicely with Reddit
    })


log('loading words.txt...')
var wordsRaw = fs.readFileSync('words.txt').toString()
const words = wordsRaw.split('\n')
delete wordsRaw
log('words.txt loaded')

log('Waiting for posts...')
snooper.watcher.getPostWatcher(config.source_subreddit)
    .on('post', function (post) { // post will be a json object containing all post information
        log('got a post')
        const data = post.data
        log(data.url)
        const title = data.title
        log(title)
        if (/_+/.test(title)) {
            log('title contains underscores')
            const word = words[Math.floor(Math.random() * (words.length - 1)) + 1];
            log('inserting', word)
            const newTitle = title.replace(/_+/, word);
            log(newTitle)
            log('submitting post')
            snooper.api.post("/api/submit", {
                api_type: "json",
                title: newTitle,
                //text: `This is from ${data.url}\nI just wasn't able to figure out how to crosspost with the API yet\nBeep boop, I'm a bot`,
                kind: 'link',
                url: data.url,
                sr: config.post_subreddit,
            }, function (err, statusCode, data) {
                if (!err) {
                    log('post submitted')
                    log(data)
                }
            })
        }
        else {
            log('title doesn\'t contain underscores')
            const word = words[Math.floor(Math.random() * (words.length - 1)) + 1];
            log('AnswerOuija says', word)
            log('submitting post')
            snooper.api.post("/api/submit", {
                api_type: "json",
                title: `AnswerOuija says ${word}`,
                //text: `This is from ${data.url}\nI just wasn't able to figure out how to crosspost with the API yet\nBeep boop, I'm a bot`,
                kind: 'link',
                url: data.url,
                sr: config.post_subreddit,
            }, function (err, statusCode, data) {
                if (!err) {
                    log('post submitted')
                    log(data)
                }
            })
        }
    })
    .on('error', console.error)
