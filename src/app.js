import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swagger from 'swagger-ui-express';
import apiDocs from '../swagger.json' assert {type:'json'};
import { NotFoundMiddleware } from './middlewares/notFound.middleware.js';


// importing routes
import authRouter from './routes/user.routes.js';

const app = express();


// Swggaer
app.use('/api/docs', swagger.serve, swagger.setup(apiDocs));


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'16kb'}));
app.use(cookieParser());


app.get('/', (req, res)=> {
    res.send('<h1>Auth API</h1><a href="/api/docs">Documentaion</a>');
})

// routers

app.use('/api/auth', authRouter);

app.use(NotFoundMiddleware);





export {app}