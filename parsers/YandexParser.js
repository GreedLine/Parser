// https://yandex.ru/maps/56/chelyabinsk/?ll=61.402554%2C55.159897&z=11

const Parser = require('./Parser')
const Emitter = require('../utils/ParserEmitter')

class YandexParser extends Parser {

    constructor(companyName, events) {
        super(companyName, 'yandex');
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
        await this.gotoYandex()
        await this.createDirectory()
        await this.searchFilials()
    }

    async gotoYandex() {
        if (!this.isCrashed) {
            if (this.companyName) {
                this.emitter.emitParserStart(this)
                await this.page.setViewport({
                    width: 1920,
                    height: 4080
                })
                await this.page.setRequestInterception(true);
                this.page.on('request', interceptedRequest => {
                    if (interceptedRequest.url().indexOf('https://core-renderer-tiles.maps.yandex.net/tiles') + 1 || interceptedRequest.url().indexOf('https://avatars.mds.yandex.net/') + 1) {
                        interceptedRequest.abort();
                    } else {
                        interceptedRequest.continue();
                    }
                });
                await this.page.goto(`https://yandex.ru/maps/56/chelyabinsk/?ll=61.402554%2C55.159897&z=11`)
            } else {
                throw new Error('company name is required')
            }
        }
    }

    async searchFilials() {
        if (this.page !== null) {
            try {
                await this.page.waitForSelector(".input__control");
                await this.page.type('.input__control', this.companyName, {delay: 130});
                await this.page.click(".small-search-form-view__icon");
                await this.page.waitForTimeout(1500)
                if (this.page._target._targetInfo.url.indexOf('chelyabinsk/search/') === -1
                && this.page._target._targetInfo.url.indexOf('chelyabinsk/chain/') === -1){
                    await this.singlePage()
                } else {
                    await this.page.setViewport({
                        width: 1920,
                        height: 4080
                    })
                    await this.page.waitForSelector(".search-list-view__list");
                    let selectors = await this.page.$$('.search-snippet-view');
                    for (let i = 0; i < selectors.length; i++) {
                        try {
                            await this.page.click(`.search-snippet-view:nth-child(${i + 1})`)
                            await this.singlePage();
                            await this.page.click('._type_back')
                            await this.page.waitForSelector(".search-snippet-view");
                        } catch (e) {
                            console.log('Всё сломалось')
                        }
                    }
                }
                await this.close('success')
            } catch (e) {
                await this.close('search')
            }
        }
    }

    async singlePage(){
        await this.page.waitForSelector('.business-contacts-view__address')
        let address = await this.page.evaluate(() => {
            let data = document.querySelector('.business-contacts-view__address').innerText;
             data.replace(/[\\\/]/g, '');
            return {
                data
            }
        });


        await this.page.waitForSelector(".carousel__content")
        await this.page.click('body > div.body > div.app > div.sidebar-container > div.sidebar-view._name_search-result._shown._view_full > div.sidebar-view__panel > div.scroll._width_narrow > div > div.scroll__content > div > div.business-card-view__main-wrapper > div:nth-child(6) > div.sticky-wrapper._position_top._no-shadow > div.tabs-select-view._border > div > div > div.carousel__scrollable._smooth-scroll > div.carousel__content > div:nth-child(2)')
        await this.page.waitForTimeout(1500)
        await this.page.click('div.tabs-select-view__title._name_reviews')
        try {
            await this.page.waitForSelector('.reviews-view')
            const element = await this.page.$('section.reviews-view');
            try{
                await element.screenshot({path: `img/${this.companyName}/${this.placeName}/${address.data}_${this.companyName}_reviews.png`});
            }catch (e) {
                await element.screenshot({path: `img/${this.companyName}/${this.placeName}/${this.companyName}_reviews.png`});
            }
        } catch (e) {
            await this.close('screenshot')
        }
    }

}

module.exports = YandexParser;
