/**
 * @author Arie M. Prasetyo
 * @description create Zoom meeting using Zoom API
 * @copyright 2021
 */

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const rp = require('request-promise');
const express = require('express');

// get config vars from .env file
dotenv.config();

const BASE_URL = 'https://api.zoom.us/v2';
const SERVER_PORT = 3321;

// create the express instance
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// create JWT token
const payload = {
  iss: process.env.API_KEY,
  exp: ((new Date()).getTime() + 60000)
};
const JWT_TOKEN = jwt.sign(payload, process.env.API_SECRET);

// options for accessing the Zoom API
const options = {
  uri: '',
  json: true, 
  qs: { status: 'active' },
  auth: { 'bearer': JWT_TOKEN },
  headers: {
    'User-Agent': 'Zoom-api-Jwt-Request',
    'content-type': 'application/json'
  }
};


// GET USER INFO =========================================================
app.get('/info/:useremail', (req, res) => {

  const target_uri = BASE_URL + `/users/${req.params.useremail ? req.params.useremail : 'me'}`;
  const opt = Object.assign({}, options, {uri: target_uri});

  // MAKE THE REQUEST CALL
  rp(opt)
  .then( response => {
    res.send({
      status: 'successful',
      user_info: response
    });
  })
  .catch( err => {
    // API call failed
    console.error('API call failed, reason ', err);
  });

});


// LIST SCHEDULED MEETINGS =========================================================
app.get('/meetings/:useremail', (req, res) => {

  const target_uri = BASE_URL + `/users/${req.params.useremail ? req.params.useremail : 'me'}/meetings`;
  const opt = Object.assign({}, options, {uri: target_uri});

  // MAKE THE REQUEST CALL
  rp(opt)
  .then( response => {
    res.send({
      status: 'successful',
      user_meetings: response
    });
  })
  .catch( err => {
    // API call failed
    console.error('API call failed, reason ', err);
  });

});


// CREATE A MEETING =========================================================
app.post('/meeting/create', (req, res) => {

  const request_body = req.body;
  
  const target_uri = BASE_URL + `/users/me/meetings`;
  const opt = Object.assign({}, options, {uri: target_uri, method: 'POST', body: request_body});

  // MAKE THE REQUEST CALL
  rp(opt)
  .then( response => {
    res.send({
      status: 'successful',
      meeting_info: response
    });

  })
  .catch( err => {
    // API call failed
    console.error('API call failed, reason ', err);
  });

});

// =========================================================


// run server
app.listen(SERVER_PORT, () => {
  console.log(`Example app listening on port ${SERVER_PORT}!`)
});