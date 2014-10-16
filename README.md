EasyExtend
==========

Userscript friendly easy extension loader for Scratch 2.0.


## Installation

Installation of EasyExtend is simple if you have a userscript manager, like [Tampermonkey (Chrome)](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Greasemonkey (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)

You can find and install the userscript [here](https://github.com/bleush38p/EasyExtend/raw/master/main.user.js).

If your userscript manager automatically processes .user.js files, it should be able to install EasyExtend simply by clicking the "install" button. If so you can test EasyExtend out by seeing inside any Scratch project and checking under the "more blocks" tab for EEXT/importer blocks.

If your userscript manager did not automatically process the script, you may need to download it and install it manually. You should refer to the instructions that go along with your browser or userscript manager.

## Use

Once EasyExtend has been installed, it can be used immediately.

#### Importing EEXT Libraries

EEXT libraries are maintained by the EasyExtend developer and hosted in the EasyExtend codebase. Because of this, they can be verified for safety and installed without worry of importing malicious code.

No EEXT blocks should be run until EEXT is ready. To do this, you can place them under the `on EEXT ready` hat or after a script using the `EEXT ready?` boolean.

To choose EEXT libraries to be imported, use the `add EEXT library [ v]` block. You can add as many libraries as you need by adding more of these blocks to the stack. When these block are run, selected libraries are queued for installation, but *not actually imported yet.*

Once you have imported all the libraries you need, use the `load missing libraries` block to insert them. This block will import any libraries which have been queued, unless they have already been installed. This block will delay execution of the rest of the stack until all libraries have been installed.

If the user allows the libraries to be installed, the `when user installs libraries` hat will execute and `user installed libraries` will become true.

If the user cancels the install, the `when user cancels install` hat will execute and `user canceled install?` will become true.

#### Importing External Libraries

EEXT also has support for installing external libraries by their URL. As these libraries could come from any source and are allowed to execute javascript on a page, security and safety for the end-user are of high priority for this project. Thus, it is recommended that if you have developed a library, you submit it to be an EEXT library.

The user will be warned of the dangers of importing foreign javascript and encouraged to only do so if they trust the source.

Because EEXT doesn't want to be allowed to import *any javascript file on the web*, a `manifest.json` must accompany each extension, which must be on the same domain as the script. The format for this manifest is WIP.

To import external libraries, the `add external library [ ]` block is used. The finer points of this block are identical to those of the `add EEXT library [ v]` block, except for instead of installing a preset extension, one will be loaded from the URL given.

**Note that linking a library's javascript file directly will NOT WORK for safety reasons. The block must import the `manifest.json` which accompanies that library.**
