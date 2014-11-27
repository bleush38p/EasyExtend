[❮](#exts) EEXT:data
====================
Adds ability for Scratch to save data which persists by project and by user. Multiple projects running at once can even interact with the same data. Data is never sent anywhere by this extension, and can always be cleared from the console.

## Permissions
### Persistant data storage
Store data which stays on your computer even after the project has stopped.

## Blocks
#### ![<EEXT/data ready?>](/pages/extensions/eext/data/block0.png "<EEXT/data ready?>")
*boolean* — reports true once the extension has been loaded.

#### ![[set [] to []]](/pages/extensions/eext/data/block1.png "[set [] to []]")
*stack* — sets a variable with a given name to a specific value, which will remain set until the variable is deleted by the project or the user, even in a new session.

#### ![([])](/pages/extensions/eext/data/block2.png "([])")
*reporter* — reports the value of the variable specified or `0` if undefined.

#### ![[delete []]](/pages/extensions/eext/data/block3.png "[delete []]")
*stack* — removes the definition of the specified variable, deleting it from storage.

#### ![[set [] to [] for this creator]](/pages/extensions/eext/data/block4.png "[set [] to [] for this creator]")
*stack* — sets a variable with a given name to a specific value, which will remain set until the variable is deleted by the project or the user, even in a new session, and will report that value for any projects made by that creator.

#### ![([] for this creator)](/pages/extensions/eext/data/block5.png "([] for this creator)")
*reporter* — reports the value of the project-creator-wide variable specified or `0` if undefined.

#### ![[delete [] for this creator]](/pages/extensions/eext/data/block6.png "[delete [] for this creator]")
*stack* — removes the definition of the specified project-creator-wide variable, deleting it from storage.

## Additional Details
* Detectable: yes
* js: [extensions/data.js](https://github.com/bleush38p/EasyExtend/blob/master/extensions/data.js) [(raw)](https://github.com/bleush38p/EasyExtend/raw/master/extensions/data.js)
* manifest: [extensions/data.manifest.json](https://github.com/bleush38p/EasyExtend/blob/master/extensions/data.manifest.json) [(raw)](https://github.com/bleush38p/EasyExtend/raw/master/extensions/data.manifest.json)