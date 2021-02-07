const Parser = require('./Parser')
const Emitter = require('../utils/ParserEmitter')

class GisParser extends Parser {

    constructor(companyName, events) {
        super(companyName, 'gis');
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
        await this.gotoGis()
        await this.searchFilials()
        this.createDirectory()
        await this.saveScreen()
    }

    async gotoGis() {
        if (!this.isCrashed) {
            if (this.companyName) {
                this.emitter.emitParserStart(this)
                await this.page.setViewport({
                    width: 1920,
                    height: 4080
                })
                await this.page.goto(`https://2gis.ru/chelyabinsk/search/${this.companyName}`)
            } else {
                throw new Error('company name is required')
            }
        }
    }

    async searchFilials() {
        if (this.page !== null) {
            try {
                let data = [];
                let selectors = await this.page.$$('._vhuumw');

                for (let i = 0; i < selectors.length; i++) {
                    const item = await (await selectors[i].getProperty('innerText')).jsonValue();
                    if (this.companyName.toLowerCase() === item.toString().toLowerCase()) {
                        data.push(selectors[i])
                    }
                }
                if (data.length === 0) {
                    await this.close('search')
                } else {
                    await this.goToOurFilials(data)
                }
            } catch (e) {
                await this.close('search')
            }

        }

    }

    async goToOurFilials() {
        try {
            await this.page.click('#root > div > div > div._byeclqp > div._1u4plm2 > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div._1tdquig > div._z72pvu > div > div > div > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1) > div');
            await this.page.waitForSelector('._1pbewv7', {
                visible: true,
            });
            await this.page.click('#root > div > div > div._byeclqp > div._1u4plm2 > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div._jcreqo > div._1tdquig > div > div > div > div > div:nth-child(1) > div > div._1b96w9b > div._18d40fw > div > div > div._jro6t0 > div:nth-child(3) > div');

            try {
                await this.page.waitForSelector('#root > div > div > div._byeclqp > div._1u4plm2 > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div._jcreqo > div._1tdquig > div > div._3zzdxk > div > div > div:nth-child(1) > div > div._1b96w9b > div:nth-child(2) > div._ci8dd0 > div:nth-child(1) > ul > li._120g3oa > label\n', {
                    visible: true,
                });
                await this.page.click('#root > div > div > div._byeclqp > div._1u4plm2 > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div._jcreqo > div._1tdquig > div > div._3zzdxk > div > div > div:nth-child(1) > div > div._1b96w9b > div:nth-child(2) > div._ci8dd0 > div:nth-child(1) > ul > li._120g3oa > label\n')
                await this.page.waitForSelector('#root > div > div > div._byeclqp > div._1u4plm2 > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div._jcreqo > div._1tdquig > div > div._3zzdxk > div > div > div:nth-child(1) > div > div._1b96w9b > div:nth-child(2) > div._ktlstk > div > div > div')

                await this.page.waitForTimeout(1000)

                let readMoreSelectors = await this.page.$$('._14r4upv');
                for (let i = 0; i < readMoreSelectors.length; i++) {
                    await this.page.click('._14r4upv')
                    await this.page.waitForTimeout(300)
                }
            } catch (e) {
                await this.page.setViewport({
                    width: 1920,
                    height: 1080
                })
                const element = await this.page.$('._18lzknl');
                await element.screenshot({path: `img/${this.companyName}/${this.placeName}/${this.companyName}_reviews.png`});
            }

        } catch (e) {
            await this.close('search')
        }

    }

    async saveScreen() {
        if (this.page !== null) {
            try {
                const element = await this.page.$('._1b96w9b');
                await element.screenshot({path: `img/${this.companyName}/${this.placeName}/${this.companyName}_reviews.png`});
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

module.exports = GisParser;
