'use strict'

const express = require('express')
const graphqlMiddleware = require('express-graphql')
const router = express.Router()
const Schema = require('../graphql/model')

router.all('/',
  graphqlMiddleware({
    schema: Schema,
    pretty: true
  })
)

module.exports = router
