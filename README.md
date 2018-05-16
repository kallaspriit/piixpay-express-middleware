# Piixpay.com payments API express middleware

[![Travis](https://img.shields.io/travis/kallaspriit/piixpay-express-middleware.svg)](https://travis-ci.org/kallaspriit/piixpay-express-middleware)
[![Coverage](https://img.shields.io/coveralls/kallaspriit/piixpay-express-middleware.svg)](https://coveralls.io/github/kallaspriit/piixpay-express-middleware)
[![Downloads](https://img.shields.io/npm/dm/piixpay-express-middleware.svg)](http://npm-stat.com/charts.html?package=piixpay-express-middleware&from=2015-08-01)
[![Version](https://img.shields.io/npm/v/piixpay-express-middleware.svg)](http://npm.im/piixpay-express-middleware)
[![License](https://img.shields.io/npm/l/piixpay-express-middleware.svg)](http://opensource.org/licenses/MIT)

**Express middleware for receiving payments using piixpay.com.**

- Provides a working example express server application.
- Provides QR code rendering.
- Provides express middleware that handles the callbacks.
- Written in TypeScript, no need for extra typings.
- Supports creating invoices, getting invoice info, getting rates.

![Example application](https://raw.githubusercontent.com/kallaspriit/piixpay-express-middleware/master/example/screenshot.jpg)

## Installation

This package is distributed via npm

```cmd
npm install piixpay-express-middleware
```

## Configuration

The example application requires API key.

To set these, create a ".env" file in the project root directory with contents like:

```
SERVER_HOST=example.com
SERVER_PORT=3000
SERVER_USE_SSL=false
SERVER_CERT=fullchain.pem
SERVER_KEY=privkey.pem

API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Commands

- `yarn start` to start the example application.
- `yarn build` to build the production version.
- `yarn test` to run tests.
- `yarn coverage` to gather code coverage.
- `yarn lint` to lint the codebase.
- `yarn prettier` to run prettier.
- `yarn audit` to run all pre-commit checks (prettier, build, lint, test)