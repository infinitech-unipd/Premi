# Premi

![Premi logo](/public/android-chrome-192x192.png?raw=true)

Premi is a web application with whom the user can create and edit slideshows as happens with [Prezi](http://prezi.com), [Strut](http://strut.io), [Slides](http://slides.com) and others.

It is a didactic project of Software Engineering course held in [Università degli Studi di Padova](http://www.unipd.it) during Academic Year 2014-2015 proposed by [Zucchetti S.p.a.](http://www.zucchetti.it/)

Project specifications are available [here](http://www.math.unipd.it/~tullio/IS-1/2014/Progetto/C4.pdf) (PDF in italian).

## What it is made by

Premi uses several frameworks and libraries from the web.

* [MEAN.JS](https://github.com/meanjs/mean) - A full-stack JavaScript open-source solution, which provides a solid starting point for [MongoDB](https://www.mongodb.org/), [Node.js](https://nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](https://angularjs.org/) based applications.
* [Fabric.js](http://fabricjs.com/) - A powerful and simple JavaScript HTML5 canvas library.
* [Materialize](http://materializecss.com/) - A modern responsive front-end framework based on [Material Design](https://www.google.com/design/spec/material-design/).
* [Impress.js](https://github.com/impress/impress.js) - A presentation framework based on the power of CSS3 transforms and transitions in modern browsers and inspired by the idea behind [Prezi](http://prezi.com).
* [jsPDF](https://parall.ax/products/jspdf) - A HTML5 client-side solution for generating PDFs.

## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine.

1. Download and install Node.js from http://www.nodejs.org/download/ and the npm package manager.
2. Download and install MongoDB from http://www.mongodb.org/downloads and make sure it is running on the default port 27017.
3. [Bower](http://bower.io/) is the front-end dependencies manager. Make sure you have installed Node.js and npm first, then install bower globally using npm:

```bash
$ [sudo] npm install -g bower
```

4. [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ [sudo] npm install -g grunt-cli
```

## Installation

To install Premi dependencies you are going to use npm. In the application root folder run this in the command-line:

```bash
$ npm install
```

This command does a few things:

1. it will install the dependencies needed for the application to run;
2. if you're running in a *development* environment, it will then also install dev dependencies needed for testing and running your application;
3. when the install process is over, npm will initiate a `bower install` command to install all the front-end modules needed for the application.

If the third step does not end with success, manual front-end dependencies installation may be needed. Run this in the command-line:

```bash
$ bower --allow-root --config.interactive=false install
```

## Running Premi locally

After the install process is over, you'll be able to run Premi using Grunt, just run:

```
$ grunt
```

Premi should run on port 3000 with the *development* environment configuration, so in your browser just go to [localhost:3000](http://localhost:3000).

Explore `config/env/development.js` for development environment configuration options.

### Running in *production* mode

To run Premi with *production* environment configuration, execute grunt as follows:

```bash
$ grunt prod
```

The application will be minified and started.

Explore `config/env/production.js` for production environment configuration options.

## Running Premi in a server

In order to leave Premi running in a server, npm module [forever](https://www.npmjs.com/package/forever) is required. Run this in the command line:

```bash
$ [sudo] npm install -g forever
```

Then go to application root folder and run:

```bash
$ NODE_ENV=production PORT=3000 forever start server.js
```

Now Premi is running on server port 3000 with *production* environment.

## Who made this

| Member name | GitHub |
|-------------|--------|
| Simone Campagna | [campagna91](https://github.com/campagna91) |
| Enrico Ceron | [enron92](https://github.com/enron92) |
| Mattia Favaron | [shake91](https://github.com/shake91) |
| Antonio Iacobucci | [antonioiacobucci](https://github.com/antonioiacobucci) |
| Tommaso Miotto | [tmiotto4](https://github.com/tmiotto4) |
| Alex Ruzzante | [alexrzz](https://github.com/alexrzz) |

Visit team website at [infinitech-unipd.github.io](http://infinitech-unipd.github.io).

## License

Premi files are released under [GNU AGPLv3 License](http://www.gnu.org/licenses/agpl-3.0.html).

> Premi
>
> Copyright (C) 2015 InfiniTech
>
> This program is free software: you can redistribute it and/or modify
> it under the terms of the GNU Affero General Public License as
> published by the Free Software Foundation, either version 3 of the
> License, or (at your option) any later version.
>
> This program is distributed in the hope that it will be useful,
> but WITHOUT ANY WARRANTY; without even the implied warranty of
> MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
> GNU Affero General Public License for more details.
>
> You should have received a copy of the GNU Affero General Public License
> along with this program. If not, see http://www.gnu.org/licenses/.
