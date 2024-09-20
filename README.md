# onsk-extension
A student project making an extension for the website https://www.onsk.no/
## Popup.js Functions
This section contains explanations for each function in the file popup.js
### function httpStatusCheck(httpsStatusCode)
This function takes in one parameter, the HTTP status code, and checks if it is within the range of 200-300. If this succeeds, it returns true, if not it returns false.
### async function postItem(url, object)
This function is responsible for sending "the wish" in the form of a JSON object created in `getParseLink()` to Ønsk's API.


This function takes in two parameters, one for the url endpoint and the other is an object. The function uses the fetch method to send a POST HTTP request with the parameter object as its body. After executing the POST request the function sends the response to `httpStatusCheck()` to see if it succeeded. If it does succeed, it returns the JSON it received. If it fails, it throws an error.
### async function getParseLink(url)
This function is responsible for analyzing the website the user is on when the extension is opened. 


This function takes in one parameter, a url endpoint, typically the url of the website the user is on when the extension is opened. The function uses the fetch method to send a GET HTTP request. After executing the GET request the function sends the response to `httpStatusCheck()` to see if it succeeded. If it does succeed it returns the json it received, if it fails it throws an error.


After the status check is done and if it succeeded, the values of the JSON object is reconstructed into a new object that fits the needs of the POST item endpoint. The POST item endpoint requires three keys (title, image, url) with values. Once the new object is created a call to `postItem()` is made with the object information and the listId from the list selected by the user.
### async function getWishLists(url)
This function is responsible for collecting the user's wish lists. 


This function takes in one parameter, a url endpoint. The function uses the fetch method to send a GET HTTP request. After executing the GET request the function sends the response to `httpStatusCheck()` to see if it succeeded. If it does succeed it returns the json it received, if it fails it throws an error.


After the status check is done and if it succeeded, a loop looks through all keys and values of the JSON objects data object and pushes all values to the global variable `wishObjs`.
### async function getCurrentTab()
This function is responsible for collecting the website address from the Chrome browser.


Two variables are created in this function, the `[tab]` variable awaits `chrome.tabs.query()` and sends in the `queryOptions` local variable which contains query options. The `[tab]` variable deconstructs an array made from the `queryOptions` variable, taking the first element we need called "tab". Afterwards it returns the url from the `tab` object.
### async function getMe(url)
This function is responsible for checking if the user is logged in, and builds the extension popup website if the user is not logged in.


This function takes in one parameter, a url endpoint. The function uses the fetch method to send a GET HTTP request. After executing the GET request the function sends the response to `httpStatusCheck()` to see if it succeeded. If it does succeed it returns the json it received, if it fails it throws an error.


After the status check is done and if it succeeded, a call is made to the `getWishLists()` async function with the global `api` variable with "wish-lists" concatenated at the end. The response from `getWishLists()` goes through a for loop and populates the option tags in the selected select tag with values being ids and innerHTML being the name. After the select tag is populated, another for loop checks for the previously selected option by comparing the values of all the option tags to the global variable `lastListSelected` once this option is found, it is set as the "selectedIndex" before escaping the for loop with a break keyword.


After the `getWishLists()` async function call is done, the `getCurrentTab()` async function is called. The response from this function is used to set the value of the website input tag.


After the `getCurrentTab()` async function call is done, an event listener is added to the "Legg til" button. On a click this button calls `getCurrentTab()` and sends its result to `getParseLink()`, where the api endpoint is the `api` global variable concatenated with "schema/parser?=url=" and the result of `getCurrentTab()`.


Another event listener is added to the button where on a click the "success" div is set to "display: unset;", and the selected wishlist is stored in the extensions local storage with the key "selected".


If `getMe()` throws an error, a `catch()` is run and sets the display of everything in the main tag to "none". Afterwards a div is generated before generating a h1 element asking the user to log in at Ønsks website which is appended to the generated div, then a button is generated with its inner text being the link to Ønsks website. The button gets the attribute "type=button" before being appended to the generated div. In the end the div is appended to the body. Afterwards an event listener is added to the login button, on a click the user is redirected to a new tab with the global variable `loginRedir`.

