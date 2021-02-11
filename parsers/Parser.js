const puppeteer = require('puppeteer');
const fs = require("fs")
const EventEmitter = require('events');

class Parser {

    constructor(name, place) {
        this.companyName = name
        this.placeName = place
    }

    page = null;
    isCrashed = false
    browser = null

    async init() {
        if (this.browser === null) {
            this.browser = await puppeteer.launch({headless: false});
            this.page = await this.browser.newPage();

            await this.page.setViewport({
                width: 1920,
                height: 1080
            })
        }
    }

    createDirectory() {
        if (this.companyName) {
            fs.mkdir(`img/${this.companyName}/${this.placeName}/`, {recursive: true}, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("New directory successfully created.")
                }
            })
        } else {
            throw new Error('company name is required')
        }
    }

    async close(error) {
        console.log(error)
        if (this.page !== null) {
            await this.page.close()
            this.page = null
        }
        if (this.browser !== null) {
            await this.browser.close()
            this.browser = null
        }
        switch (error) {
            case 'screenshot':
                this.emitter.emitParserErrorFinish(this)
                break;
            case 'search':
                this.emitter.emitParserNotFoundPage(this)
                break;
            case 'success':
                this.emitter.emitParserFinish(this)
                break;
        }
    }
}

module.exports = Parser;
