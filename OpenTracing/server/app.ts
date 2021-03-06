import createHttpError from 'http-errors';
import express, { Request, Response, NextFunction, Errback } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {traceInjector} from './tracing';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();
const port = 3000;

app.use(traceInjector('server'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createHttpError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

