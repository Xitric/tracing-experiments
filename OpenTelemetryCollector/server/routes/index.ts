import {Router} from 'express';
import * as http from 'superagent';
var router = Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const msg = await http.get('http://hello-service/');
    const info = await http.get('http://info-service/');
    res.render('index', { title: 'Express', message: msg.text, info: info.text });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'Express', message: 'Internal server error' });
  }
});

export default router;
