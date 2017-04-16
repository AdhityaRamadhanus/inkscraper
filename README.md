# inkscraper
[![Build Status](https://travis-ci.org/AdhityaRamadhanus/inkscraper.svg?branch=master)](https://travis-ci.org/AdhityaRamadhanus/inkscraper) [![Dependencies Status](https://david-dm.org/adhityaramadhanus/inkscraper.svg)](https://david-dm.org/adhityaramadhanus/inkscraper) [![Code Style](https://img.shields.io/badge/code%20style-standard-green.svg)](https://github.com/feross/standard)

<p>
  <a href="#installation">Installation</a> |
  <a href="#documentation">Documentation</a> |
  <a href="#licenses">License</a>
  <br><br>
  <blockquote>
  inkscraper is jobs scraper for linkedin that comes with restful api and full-text search.

  Scraping linkedin jobs can be considered an infringement of linkedin TOS, use it carefully.

  inkscraper currently supports:

  - Scrap Listing Page (Job listing, by default this will scrape https://www.linkedin.com/jobs/view-all)
  - Scrap Details Page (Job Details Page)
  - Restful API for jobs scraped from linkedin
  - Full-text search using built-in mongoose (of course built-in mongodb too)
</p>

Installation
------------

* git clone https://github.com/AdhityaRamadhanus/Linkedin-Scraper.git
* cd Linkedin-Scraper
* npm install
* npm run start-apiserver
* npm run start-scraper
* set .env files (i'm using dotenv, see here https://www.npmjs.com/package/dotenv for documentation)
* Example of .env
```js
NODE_ENV=development

MONGOLAB_URI='mongodb://localhost:27017/linkedin-scraper'
APIDOC=true
```

Documentation
------------

* npm install -g apidoc
* cd Linkedin-Scraper
* npm run gen-doc
* add APIDOC=true in .env
* enjoy, documentation can be found in "/apidoc"

License
----

MIT © [Adhitya Ramadhanus]
