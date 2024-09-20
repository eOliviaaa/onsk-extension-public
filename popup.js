// Provided API link. NOTE: Endpoints are added on to each fetch request url
let api = "API URL";

// Redirect to onsk login site
const loginRedir = "LOGIN URL";

// List of wishlist objects
let wishObjs = [];

let lastListSelected = "";

chrome.storage.local.get(["selected"]).then((result) => {
    lastListSelected = result.selected;
}).catch(err => {console.log("Could not load storage: " + err)});  

function httpStatusCheck(response) {
    if (response.status>=200 && response.status<300) return true;
    else return false;
}

async function postItem(url = "", item = {}) {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    }).then(response => {
        if (httpStatusCheck(response)) return response.json();
        else throw new Error();
    });
}

async function getParseLink(url = "") {
    const response = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => {
        if (httpStatusCheck(response)) return response.json();
        else throw new Error();
    }).then(data => {
        let listId = document.getElementById("wish-lists").value;

        let newObj = new Object();
        newObj.title = data.title;
        newObj.image = data.image;
        newObj.url = url;

        postItem(api+"wish-lists/"+listId+"/items", newObj)
    });
}

async function getWishLists(url = "") {
    const response = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => {
        if (httpStatusCheck(response)) return response.json();
        else throw new Error();
    }).then(data=>{
        for (const [k,v] of Object.entries(data.data)){
            wishObjs.push(v)
        }
    });
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true, currentWindow: true };
    // Deconstructs an array made from "queryOptions" taking the first element we need called tab.
    let [tab] = await chrome.tabs.query(queryOptions);
    // Returns the url from tab object
    return tab.url;
}

async function getMe(url = "") {
    const response = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => {
        if (httpStatusCheck(response)) return response.json();
        else throw new Error();
    }).then(() => {
        getWishLists(api+"wish-lists").then(() => {
            let selectTag = document.getElementById("wish-lists")
            for (const i of wishObjs) {
                let opt = document.createElement("option");
                opt.innerHTML = i.name;
                opt.value = i.id;
                selectTag.append(opt);
            }

            for(let i, j = 0; i = selectTag.options[j]; j++) {
                if(i.value == lastListSelected) {
                    selectTag.selectedIndex = j;
                    break;
                }
            }
        });
        
        getCurrentTab().then(res => {
            const expression = "(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?\/[a-zA-Z0-9]{2,}"
            const regex = new RegExp(expression);

            if (res.match(regex)) document.getElementById("website").value=res;
            else document.getElementById("website").value="";
        });
        
        document.getElementById("btn-add-wish").addEventListener("click", () => {
            getCurrentTab().then(res => {
                getParseLink(api+"schema/parser?url="+res)
            });
        });
        document.getElementById("btn-add-wish").addEventListener("click", () => {
            document.getElementById("success").style.display = "unset"
            let selected = document.getElementById("wish-lists").value
            chrome.storage.local.set({ "selected": selected });
        }); 
    })
    .catch(err => {
        document.getElementById("content").style.display = "none";

        const notLoginDiv = document.createElement("div");
        notLoginDiv.classList.add("no-login-div");
        
        const btnLogin = document.createElement("button");
        btnLogin.innerText = "Gå til innlogging";
        btnLogin.classList.add("no-login-btn");
        btnLogin.setAttribute("type", "button");
        notLoginDiv.appendChild(btnLogin);

        document.getElementsByTagName('body')[0].appendChild(notLoginDiv);

        btnLogin.addEventListener("click", function(){
            chrome.tabs.create({url:loginRedir});
        });
    });
}

getMe(api+"me")
