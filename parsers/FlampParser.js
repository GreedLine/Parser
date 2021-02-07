const Parser = require('./Parser')
const Emitter = require('../utils/ParserEmitter')

class FlampParser extends Parser {

    constructor(companyName, events) {
        super(companyName, 'flamp');
        this.emitter = new Emitter();
        this.emitter.onParserStarted(events.onStarted)
        this.emitter.onParserFinish(events.onFinish)
        this.emitter.onParserErrorFinish(events.onFinishError)
        this.emitter.onParserNotFoundPage(events.onPageNotFound)
        this.emitter.onParserSaveScreen(events.onSavedScreen)
        this.emitter.onParserNotSaveScreen(events.onNotSavedScreen)
    }


    async parse() {
        await this.init()
        await this.gotoFlamp()
        await this.searchFirstCompany()
        this.createDirectory()
        await this.saveScreen()
    }

    async gotoFlamp() {
        if (!this.isCrashed) {
            if (this.companyName) {
                this.emitter.emitParserStart(this)
                await this.page.goto(`https://chelyabinsk.flamp.ru/search/${this.companyName}`)
            } else {
                throw new Error('company name is required')
            }
        }
    }

    async searchFirstCompany() {
        if (this.page !== null && this.page._target._targetInfo.url.indexOf('firm') < 1) {
            try {
                await this.page.click('#page > cat-layouts-page > cat-pages-search > section > section > div.l-search__content > div.page__block.page__block--margin-bt-x4 > cat-layouts-list-cards > ul > li:nth-child(1) > cat-layouts-card > section');
                await this.page.waitForSelector('.ugc-item', {
                    visible: true,
                });
            } catch (e) {
                this.emitter.emitParserNotFoundPage(this)
                await this.close('search')
            }
        }
    }

    async saveScreen() {
        if (this.page !== null) {
            try {
                await this.page.screenshot({path: `img/${this.companyName}/${this.placeName}/${this.companyName}_Header.png`});
                await this.page.screenshot({
                    path: `img/${this.companyName}/${this.placeName}/${this.companyName}_ull.png`,
                    fullPage: true
                });
                const element = await this.page.$('#reviews');
                await element.screenshot({path: `img/${this.companyName}/${this.placeName}/${this.companyName}_Footer.png`});
                this.emitter.emitParserSaveScreen(this)
                await this.close('success')

            } catch {
                console.log('Screenshot is crash')
                this.emitter.emitParserNotSaveScreen(this)
                await this.close('screenshot')
            }
        }
    }


}

module.exports = FlampParser;
