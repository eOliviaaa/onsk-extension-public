console.log("Background.js says hi <3")



// Functionality to open the extension through the context menu that appears with a right click could not be implemented
// as Chrome currently limits the openPopup() functionality to developer versions. 
// https://developer.chrome.com/docs/extensions/reference/api/action#method-openPopup
// Note, if this is implemented in the future you need to add contextMenus to the manifest.json permissions.
// If openPopup() was functional, it would look something like this:

/*
function genericOnClick(info) {
    console.log("You clicked the menu option!");
    openPopup();
}

chrome.runtime.onInstalled.addListener(function () {
    let context = 'page';
    let title = "Legg til side på Ønsk";
    let menuID = "Onsk contextMenu";
    chrome.contextMenus.create({
        title: title,
        contexts: [context],
        id: menuID
    });
});
        
chrome.contextMenus.onClicked.addListener(genericOnClick); 
*/
