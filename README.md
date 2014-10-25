EasyExtend
==========

Userscript friendly easy extension loader for [Scratch 2.0](http://scratch.mit.edu).


## Installation

Installation of EasyExtend is simple if you have a userscript manager, like [Tampermonkey (Chrome)](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Greasemonkey (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)

You can find and install the userscript [here](https://github.com/bleush38p/EasyExtend/raw/master/main.user.js).

If your userscript manager automatically processes .user.js files, it should be able to install EasyExtend simply by clicking the "install" button. If you can see a button with the letter "E" at the top of any Scratch project page, the script has been successfully installed.

If your userscript manager did not automatically process the script, you may need to download it and install it manually. You should refer to the instructions that go along with your browser or userscript manager.

## Use

Once EasyExtend has been installed, it can be used immediately.

Simply click on the EasyExtend button at the top of the page, which is either on the right of the navigation bar or to the left of the "Share" or "Remix" button in the project editor. If an error occurs, check the console for more information. If you can not see the EEXT blocks or they disappear, reload the page and wait to click the button again until the project has loaded.

#### Importing EEXT Libraries

EEXT libraries are maintained by the EasyExtend developer and hosted in the EasyExtend repository. Because of this, they can be verified for safety and installed without worry of importing malicious code.

No EEXT blocks should be run until EEXT is ready. To do this, you can place them under the `on EEXT ready` hat or after a script using the `EEXT ready?` boolean.

To choose EEXT libraries to be imported, use the `add EEXT library [ v]` block. You can add as many libraries as you need by adding more of these blocks to the stack. When these block are run, selected libraries are queued for installation, but *not actually imported yet.*

Once you have added all the libraries you need, use the `load missing libraries` block to load them into the project. This block will import any libraries which have been queued, unless they have already been installed.

If the user allows the libraries to be installed, the `when install is successful` hat will execute its stack and `installation successful?` will become true.

If the user cancels the install, the `when install is canceled` hat will execute its stack and `installation canceled?` will become true.

If the install fails for some reason, the `when install fails` hat will execute its stack and `installation failed?` will become true. You can check the console for more information on what happened.

EasyExtend automatically adds a one second delay after extensions have been imported, but even after the `when install is successful` hat has become active and `installation canceled?` has become true, some extensions that take longer to load might not be ready yet, especially for users with slower internet speeds. To ensure that extensions are available for all users when they are needed, you should make an effort to check the `ready?` blocks for each imported extension, if they have one, before executing blocks that rely on that extension.

Automatic import verification may be added in the future, but this is still a good habit to get into.

#### Importing External Libraries

**Currently, external libraries cannot be imported. This functionality is WIP and will be added soon.**

EEXT also has support for installing external libraries by their URL. As these libraries could come from any source and are allowed to execute javascript on a page, security and safety for the end-user are of high priority for this project. Thus, it is recommended that if you have developed a library, you submit it to be an EEXT library.

The user will be warned of the dangers of importing foreign javascript and encouraged to only do so if they trust the source.

Because EEXT isn't and shouldn't be allowed to import *any javascript file on the web*, a `manifest.json` must accompany each extension, which must be on the same domain as the script. The format for this manifest is laid out later in this document.

Ex: `add external library [http://myshinywebsite.com/files/libraries/myextension.mainfest.json]`

This manifest then links to the `.js` file to be imported if the user chooses to do so.

To import external libraries, the `add external library [ ]` block is used. This block is identical to the `add EEXT library [ v]` block, except for instead of installing a preset extension, one will be loaded from the URL given.

Note that linking a library's javascript file directly will NOT WORK for safety reasons. The block must import the `manifest.json` which accompanies that library.

## The manifest.json file

Make sure that your manifest is valid json. **If there is an error in the manifest, or it does not contain required information, the import will fail, likely silently, and in the worst case the import dialog will be undismissable.** Because of this, editing the json file by hand is discouraged. Remember that json is stricter than javascript object notation - for example, json strings (properties and values) must be wrapped in double quotes.

In order for an extension to be imported, it must have a manifest. The format for the manifest is as follows:

#### name
*(Required)* The name of the extension.
```
"name": "MyAwesomeExtension"
```
Ideally, this name is the same as the name that will appear in Scratch.

#### author
*(Required)* An array containing the name and url of the author of the extension. The url can point to either documentation for the extension or a page with information about the author, like a Scratch profile.
```
"author": [
  "bleush38p",
  "http://github.com/bleush38p"
]
```

#### js
*(Required)* An array containing javascript files to be imported. While this must be an array containing at least one item, **only the first js file will be imported**. The js should be on the same level as the manifest, and is referenced only by its filename (no path.) So, a manifest at `http://mysite.com/stuff/ext.manifest.json` referencing `myextension.js` would tell EEXT to load `http://mysite.com/stuff/myextension.js`. Slashes are not allowed in the reference to this file, and it must end with `".js"`. Conventions would suggest that the file is named the same as its manifest, though that is not required.
```
"js": [
  "extension.js"
]
```

#### desc
*(Required)* A description of the extension. It should describe (with moderate verbosity, though not to the point of being boring) the extension that will be imported.
```
"desc": "This extension can read your mind."
```

#### version
*(Optional)* A version string for the extension. No specific format is required. While this is not currently used, it may at some point be displayed to the user.
```
"version": "1.6.4a"
```

#### permissions
*(Optional)* While this is optional, it is a courtesy to the user to add a list of permissions your extension needs. This should be an array of either strings (names of existing permissions) or objects which are custom permissions.
A custom permission must include a `"name"` and `"desc"`. These should be written so that they would fluently read as "This extension needs to have {name}, which means that it can {desc}." (for example, "this extension needs to have *full internet access*, which means that it can *access the internet in an unrestricted manner*.")
```
"permissions": [
  "PERSISTANTDATA",
  {
    "name": "Mind Access",
    "desc": "Read, create, modify, and remove the information stored in your mind."
  }
]
```

Additional information in the manifest will be ignored, as long as the required components exist. A `"css"` option is planned to be added in the future.
