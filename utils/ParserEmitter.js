const EventEmitter = require('events');

class ParserEmitter extends EventEmitter {
    emitParserStart(data) {
        this.emit('parser_start', data)
    }

    emitParserFinish(data) {
        this.emit('parser_finish', data)
    }

    emitParserNotFoundPage(data) {
        this.emit('parser_not_found', data)
    }

    emitParserSaveScreen(data) {
        this.emit('parser_save_screen', data)
    }

    emitParserNotSaveScreen(data) {
        this.emit('parser_not_save_screen', data)
    }

    emitParserErrorFinish(data) {
        this.emit('parser_error_finish', data)
    }

    onParserStarted(callback) {
        this.on('parser_start', callback)
    }
    onParserFinish(callback) {
        this.on('parser_finish', callback)
    }
    onParserErrorFinish(callback) {
        this.on('parser_error_finish', callback)
    }
    onParserNotFoundPage(callback) {
        this.on('parser_not_found', callback)
    }
    onParserSaveScreen(callback) {
        this.on('parser_save_screen', callback)
    }
    onParserNotSaveScreen(callback) {
        this.on('parser_not_save_screen', callback)
    }

}

module.exports = ParserEmitter;
