const FlampParser = require("./parsers/FlampParser")
const GisParser = require("./parsers/GisParser")
const YandexParser = require("./parsers/YandexParser")

const {workerData, parentPort} = require('worker_threads')


async function parse() {

    const parserFlamp = new FlampParser(workerData, {
        onStarted: (data) => {
            parentPort.postMessage({
                value: 'Flamp parser: started',
                parser: 'Flamp',
                isFinish: false,
                isErrorFinish: false
            });
            console.log('Flamp parser started', data.companyName)
        },
        onFinish: (data) => {
            parentPort.postMessage({
                value: 'Flamp parser: Finished',
                parser: 'Flamp',
                isFinish: true,
                isErrorFinish: false
            });
            console.log('Flamp parser finish', data.companyName)
        },
        onPageNotFound: (data) => {
            parentPort.postMessage({
                value: 'Flamp parser: company not found',
                parser: 'Flamp',
                isFinish: true,
                isErrorFinish: true
            });
            console.log('Flamp parser page not found', data.companyName)
        },
        onSavedScreen: (data) => {
            parentPort.postMessage({
                value: 'Flamp parser: screenshot saved',
                parser: 'Flamp',
                isFinish: false,
                isErrorFinish: false
            });
            console.log('Flamp parser save screen', data.companyName)
        },
        onNotSavedScreen: (data) => {
            parentPort.postMessage({
                value: 'Flamp parser: screenshot not saved',
                parser: 'Flamp',
                isFinish: true,
                isErrorFinish: true
            });
            console.log('Flamp parser has not save screen', data.companyName)
        },
        onFinishError: (data) => {
            parentPort.postMessage({
                value: 'Flamp parser finished with error: screenshot not saved',
                parser: 'Flamp',
                isFinish: true,
                isErrorFinish: true
            });
            console.log('Flamp parser has not save screen', data.companyName)
        }
    })

    const parserGis = new GisParser(workerData, {
        onStarted: (data) => {
            parentPort.postMessage({
                value: 'Gis parser: started',
                parser: 'Gis',
                isFinish: false,
                isErrorFinish: false
            });
            console.log('Gis parser started', data.companyName)
        },
        onFinish: (data) => {
            parentPort.postMessage({
                value: 'Gis parser: Finished',
                parser: 'Gis',
                isFinish: true,
                isErrorFinish: false
            });
            console.log('Gis parser finish', data.companyName)
        },
        onPageNotFound: (data) => {
            parentPort.postMessage({
                value: 'Gis parser: company not found',
                parser: 'Gis',
                isFinish: true,
                isErrorFinish: true
            });
            console.log('Gis parser page not found', data.companyName)
        },
        onSavedScreen: (data) => {
            parentPort.postMessage({
                value: 'Gis parser: screenshot saved',
                parser: 'Gis',
                isFinish: false,
                isErrorFinish: false
            });
            console.log('Gis parser save screen', data.companyName)
        },
        onNotSavedScreen: (data) => {
            parentPort.postMessage({
                value: 'Gis parser: screenshot not saved',
                parser: 'Gis',
                isFinish: true,
                isErrorFinish: true
            });
            console.log('Gis parser has not save screen', data.companyName)
        },
        onFinishError: (data) => {
            parentPort.postMessage({
                value: 'Gis parser finished with error: screenshot not saved',
                parser: 'Gis',
                isFinish: true,
                isErrorFinish: true
            });
            console.log('Gis parser has not save screen', data.companyName)
        }
    })

    const parserYandex = new YandexParser(workerData, {
        onStarted: (data) => {
            parentPort.postMessage({
                value: 'Yandex parser: started',
                parser: 'Yandex',
                isFinish: false,
                isErrorFinish: false
            });
            console.log('Yandex parser started', data.companyName)
        },
        onFinish: (data) => {
            parentPort.postMessage({
                value: 'Yandex parser: Finished',
                parser: 'Yandex',
                isFinish: true,
                isErrorFinish: false
            });
            console.log('Yandex parser finish', data.companyName)
        },
        onPageNotFound: (data) => {
            parentPort.postMessage({
                value: 'Yandex parser: company not found',
                parser: 'Yandex',
                isFinish: true,
                isErrorFinish: true
            });
            console.log('Yandex parser page not found', data.companyName)
        },
        onSavedScreen: (data) => {
            parentPort.postMessage({
                value: 'Yandex parser: screenshot saved',
                parser: 'Yandex',
                isFinish: false,
                isErrorFinish: false
            });
            console.log('Yandex parser save screen', data.companyName)
        },
        onNotSavedScreen: (data) => {
            parentPort.postMessage({
                value: 'Yandex parser: screenshot not saved',
                parser: 'Yandex',
                isFinish: true,
                isErrorFinish: true
            });
            console.log('Yandex parser has not save screen', data.companyName)
        },
        onFinishError: (data) => {
            parentPort.postMessage({
                value: 'Yandex parser finished with error: screenshot not saved',
                parser: 'Yandex',
                isFinish: true,
                isErrorFinish: true
            });
            console.log('Yandex parser has not save screen', data.companyName)
        }
    })

    // await parserYandex.parse()

    await Promise.all([parserGis.parse(), parserFlamp.parse(), parserYandex.parse()])

}


const data = parse()


console.log(data)
