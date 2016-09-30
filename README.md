# emailjs-and-webpack-example

Here is an example of using [emailjs](http://emailjs.org/) packages with webpack.

Example works in browser(need to run proxy server) or [Electron](http://electron.atom.io/) (native).

## About

This is very simple email manager clinet that runs on Browser or Electron.
This source is only example of ussing emailjs + webpack - it's not working client.

### Functionality:
* Login
* Getting mailboxes
* Getting messages/emails (subject only)
* Compose new email

**IMPORTANT** if you want to login with GMAIL account, you need to allow less secure apps access. Take a look at this link: https://support.google.com/accounts/answer/6010255?hl=en. Of course in your version you can add Google OAuth.

## Installation

Quick start: 
```
npm run build-all
```

OR

Run `npm run install-all` to install all needed packages + proxy-server for work throw browser.

Then build the "dist" files with webpack: `npm run build`

If you're want to use browser: `npm run server` and go to `http://localhost:8889/`

If you're want to use Electron: `npm run electron`
