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

No EEXT blocks should be run until EEXT is ready. To do this, you can place them under the `on EEXT ready` hat or after a script using the `EEXT ready?` boolean.

To choose EEXT libraries to be imported, use the `add EEXT library [ v]` block. You can add as many libraries as you need by adding more of these blocks to the stack. When these block are run, selected libraries are queued for installation, but *not actually imported yet.*

Once you have imported all the libraries you need, use the `load missing libraries` block to insert them. This block will import any libraries which have been queued, unless they have already been installed. This block will delay execution of the rest of the stack until all libraries have been installed.

If the user allows the libraries to be installed, the `when user installs libraries?` hat will execute and `user installed libraries` will become true.
