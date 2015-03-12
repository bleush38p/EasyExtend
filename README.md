EasyExtend
==========

[![Join the chat at https://gitter.im/bleush38p/EasyExtend](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bleush38p/EasyExtend?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Userscript friendly easy extension loader for [Scratch 2.0](http://scratch.mit.edu).

*EasyExtend is currently going through a quite substantial rewrite. Please stand by :)*

### Set up a local testing environment
1. Clone EEXT, fire up the terminal, and `cd` to EasyExtend
2. A quick `npm install` will package up all EEXT's development dependencies
3. Run `grunt build-serve` to build the project and serve it on port 8888 *(if you don't want to use grunt-devserver you can use anything that can serve the files, as long as it can serve the proper headers)*
4. Open up [http://localhost:8888/build/launch.user.js](http://localhost:8888/build/launch.user.js) in the browser to load the userscript
5. In the browser's javascript console, run the following:

```
> EEXTlauncher.options('usecustom', true);
   Reload the page for changes to take effect.
< undefined
> EEXTlauncher.options('customurl', 'http://localhost:8888/');
   Reload the page for changes to take effect.
< undefined
```

<ol start="6"><li>Reload the page.</li></ol>
Resources should now be loaded from your development server. To continually build the files, run `grunt watch` in another terminal. The server will update automatically; you need only reload the browser page. Naturally, EEXTlauncher will fail when the server does not exist. If you want to switch back to hosted versions, run `EEXTlauncher.options('usecustom', false);` in the browser's javascript console.
