// const keys=require('./keys');
// const express=require('express');
// const bodyParser=require('body-parser');
// const cors=require('cors');
// const redis=require('redis');
 

// const app=express();
// app.use(cors());
// app.use(bodyParser.json());

// //postgres client setup
// console.log("all data",keys.pgUser,keys.pgHost,keys.pgDatabase,keys.pgPassword,keys.pgPort);
// const { Pool }=require('pg');
// const pgClient=new Pool({
//     user:keys.pgUser,
//     host:keys.pgHost,
//     database:keys.pgDatabase,
//     password:keys.pgPassword,
//     port:keys.pgPort
// });

// pgClient.on('error',()=>{
//     console.log("pgClient error");
// })
// pgClient.query('CREATE TABLE IF NOT EXISTS values(number INT)')
// .catch((err)=>{
//     console.log("error");
// });
// // console.log("ans",pgClient.query('select * from values'));
// // pgClient.query('CREATE TABLE IF NOT EXISTS values(number INT)')
// // .catch((err)=>{
// //     console.log("error");
// // });

// // pgClient.query('insert into values(number) values($1)',[10]);
// //redis client setup
// const redisClient=redis.createClient({
//     host: keys.redisHost,
//     port: keys.redisPort,
//     retry_strategy: ()=> 1000
// });


// const redisPublisher= redisClient.duplicate();
// // express route handlers

// app.get('/',async (req,res)=>{

//     let values=await pgClient.query('select * from values');
//     await res.send(values);
// });

// app.get('/values/all',async (req,res)=>{

//     let values=await pgClient.query('SELECT * FROM VALUES');
//     await console.log("called1");
//     await res.send(values);
// });

// app.get('/values/current',async (req,res)=>{
//     redisClient.hgetall('values',(err,values)=>{
//         res.send(values);
//     })
// })

// app.post('/values/input',async (req,res)=>{
//     await console.log("values recieved",req.body.index);
//     const index=req.body.index;

//     if(parseInt(index)>40)
//     {
//         return res.status(422).send('Request too high');
//     }
//     else
//     {
//         redisClient.hset('values',index,'Nothing yet!');
//         redisPublisher.publish('insert',index);
//         pgClient.query('insert into values(number) values($1)',[index]);
//         res.send({working:true});
//     }
   
// });

// app.listen(5000,err=>{
//     console.log("listening");
// })



const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));

const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values/input', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, err => {
  console.log('Listening');
});