console.clear();

//Module imports
import express from 'express';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';

//File imports
import __dirname from './utils.js';
import initializePassport from './config/passport.config.js';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import sessionRouter from './routes/sessions.routes.js'
import viewRouter from './routes/views.routes.js';
import userRouter from './routes/users.routes.js';
import loggerRouter from './routes/logger.routes.js';
import { config } from './config/environment.config.js';
import { messageDao } from './dao/dao.js';
import customLogger from './utils/logger.js';
import { loggerPrefix } from './utils/logger.js';
import { swaggerSpecs } from './config/doc.config.js';
import { connectDB } from "./config/connection.config.js";

const PORT = config.server.port;

const app = express();

const filename = 'app.js'

customLogger.info(loggerPrefix(filename,`Application running in ${config.environment.mode} mode`));

//Cookie Parser
app.use(cookieParser());

//Express
app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

//Passport
app.use(passport.initialize());

initializePassport();

//Handlebars
app.engine('handlebars', handlebars.engine());

app.set('views', __dirname + '/views');

app.set('view engine', 'handlebars');

//Rutas
app.use('/api/products', productRouter);

app.use('/api/carts', cartRouter);

app.use('/api/sessions', sessionRouter);

app.use('/api/users', userRouter);

app.use('/loggerTest', loggerRouter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/', viewRouter);

const server = app.listen(PORT, () => {

    customLogger.info(loggerPrefix(filename,`Server listening on port ${PORT}`));

});

const io = new Server(server);

io.on('connection', (socket) => {

    customLogger.info(loggerPrefix(filename, `Socket Connected`));

    socket.on('newMessage', async (entry) => {

        await messageDao.saveMessage(entry.username, entry.message);

        const messageHistory = await messageDao.getMessages();

        io.emit('messageLog', messageHistory.message);

    });

    socket.on('authenticated', (data) => {

        socket.broadcast.emit('newUserConnected', data);

    });

});

connectDB();