const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const {Worker} = require('worker_threads')
const port = 5456;

const server = async () => {
    const app = new Koa();
    const http = require('http').createServer(app.callback());
    const io = require('socket.io')(http, {
        cors: {
            // TODO: Сменить.
            origin: 'http://localhost:3000',
            credentials: true
        }
    });

    async function run(nameCompany) {
        console.log(nameCompany)
        const result = await runService(nameCompany)
        console.log(result);
    }

    const router = new Router()
    const corsOpts = {
        credentials: true
    };
    app.use(bodyParser())
    app.use(cors(corsOpts))
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    function runService(workerData) {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./index.js', {workerData});
            worker.on('message', (msg) => {
                io.emit('eventClient', msg);
            })
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            })
        })
    }


    router
        .post('/create/image', (ctx, next) => {
            ctx.body = ctx.request.body;
            console.log(ctx.body);
            run(ctx.body.data.companyName).catch(err => console.error(err))
        })
        .get("/info", async (ctx) => {
            ctx.body = {

                "message": 'Message'
            }
        })
    // .get("/img", async (ctx) => {
    //     base64
    //
    //     ctx.body = {
    //           base64
    //     }
    // });
    try {
        console.log('launch server')
        app
            .use(router.routes())
            .use(router.allowedMethods())
        http.listen(port)
    } catch (e) {
        console.log(e)
        process.exit(1)
    }

}

server().then(() => {
    console.log('server running in:')
})
