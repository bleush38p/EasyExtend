[❮](#dev) The Manifest.json File
================================
*This document has been transferred over from the project readme.md. It may need slight changes to properly fit into the context of this site.*

Make sure that your manifest is valid json. **If there is an error in the manifest, or it does not contain required information, the import will fail, likely silently, and in the worst case the import dialog will be undismissable.** Because of this, editing the json file by hand is discouraged. Remember that json is stricter than javascript object notation - for example, json strings (properties and values) must be wrapped in double quotes.

In order for an extension to be imported, it must have a manifest. The format for the manifest is as follows:

#### `"name"`
*(Required)* The name of the extension.

    "name": "MyAwesomeExtension"

Ideally, this name is the same as the name that will appear in Scratch.

#### `"author"`
*(Required)* An array containing the name and url of the author of the extension. The url can point to either documentation for the extension or a page with information about the author, like a Scratch profile.

    "author": [
      "bleush38p",
      "http://github.com/bleush38p"
    ]

#### `"manifest-format"`
*(Required soon)* A numeric version identifier which must be compatible with the installed version of EasyExtend. **The current manifest-format is `1`.**

    "manifest-format": 1

#### `"js"`
*(Required)* An array containing javascript files to be imported. While this must be an array containing at least one item, **only the first js file will be imported**. The js should be on the same level as the manifest, and is referenced only by its filename (no path.) So, a manifest at `http://mysite.com/stuff/ext.manifest.json` referencing `myextension.js` would tell EEXT to load `http://mysite.com/stuff/myextension.js`. Slashes are not allowed in the reference to this file, and it must end with `".js"`. Conventions would suggest that the file is named the same as its manifest, though that is not required.

    "js": [
      "extension.js"
    ]

#### `"desc"`
*(Required)* A description of the extension. It should describe (with moderate verbosity, though not to the point of being boring) the extension that will be imported.

    "desc": "This extension can read your mind."

#### `"version"`
*(Optional)* A version string for the extension. No specific format is required. While this is not currently used, it may at some point be displayed to the user.

    "version": "1.6.4a"

#### `"permissions"`
*(Optional)* While this is optional, it is a courtesy to the user to add a list of permissions your extension needs. This should be an array of either strings (names of existing permissions) or objects which are custom permissions.
A custom permission must include a `"name"` and `"desc"`. These should be written so that they would fluently read as "This extension needs to have *{name}*, which means that it can *{desc}*." (for example, "this extension needs to have *full internet access*, which means that it can *access the internet in an unrestricted manner*.")

    "permissions": [
      "PERSISTANTDATA",
      {
        "name": "Mind Access",
        "desc": "Read, create, modify, and remove the information stored in your mind."
      }
    ]

Additional information in the manifest will be ignored, as long as the required components exist. A `"css"` option is planned to be added in the future.