/* 1. Search */

let UI = {};

let search = document.querySelector(".js-search");
let searchBtn = document.querySelector(".js-submit");

UI.EnterPress = function () {
  search.addEventListener("keyup", function (e) {
    if (e.which === 13) {
      if (search.value !== "" && search.value !== " ") {
        SoundCloudAPI.getTrack(search.value);
      }
    }
  })
}

UI.EnterPress();

UI.SubmitClick = function () {
  searchBtn.addEventListener("click", function () {
    if (search.value !== "" && search.value !== " ") {
      SoundCloudAPI.getTrack(search.value);
    }
  })
}

UI.SubmitClick();

/* 2. Query SoundCloudAPI API */

let SoundCloudAPI = {};

SoundCloudAPI.init = function () {

  SC.initialize({
    client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
  });

}

SoundCloudAPI.init();

// find all sounds of buskers licensed under 'creative commons share alike'
SoundCloudAPI.getTrack = function (input) {

  SC.get('/tracks', {
    q: input
  }).then(function (tracks) {
    SoundCloudAPI.renderTracks(tracks);
  });

}

/* 3. Display the cards */

SoundCloudAPI.renderTracks = function (tracks) {

  clearResult();

  tracks.forEach(function (track) {

    //card
    let card = document.createElement("div");
    card.classList.add("card");

    //Image
    let imageDiv = document.createElement("div");
    imageDiv.classList.add("image");
    card.appendChild(imageDiv);

    let image_img = document.createElement("img");
    image_img.classList.add("image_img");
    image_img.src = track.artwork_url || "https://picsum.photos/200";
    imageDiv.appendChild(image_img);

    //content
    let content = document.createElement("div");
    content.classList.add("content");
    card.appendChild(content)

    let header = document.createElement("div");
    header.classList.add("header");
    header.innerHTML = '<a href="' + track.permalink_url + '"target="_blank">' + track.title + '</a>';
    content.appendChild(header);

    //button 
    let button = document.createElement("div");
    button.classList.add("ui", "bottom", "attached", "button", "js-button");
    card.appendChild(button);

    let icon = document.createElement("i");
    icon.classList.add("add", "icon");
    button.appendChild(icon);

    let buttonText = document.createElement("span");
    buttonText.innerHTML = "Add to playlist";
    button.appendChild(buttonText);

    let searchResults = document.querySelector(".js-search-results");
    searchResults.appendChild(card);

    button.addEventListener('click', function () {
      SoundCloudAPI.embaded(track.permalink_url);
    })

  });

}

/* 4. Add to playlist and play */
let sideBar = document.querySelector(".inner");
SoundCloudAPI.embaded = function (trackUrl) {
  SC.oEmbed(trackUrl, {
    auto_play: false
  }).then(function (embed) {
    let sideBar = document.querySelector(".inner");

    let box = document.createElement("div");
    box.innerHTML = embed.html;

    sideBar.insertBefore(box, sideBar.firstChild);
    localStorage.setItem("key", sideBar.innerHTML);

  });
}

sideBar.innerHTML = localStorage.getItem("key");

// clear search result 
function clearResult() {
  let content = document.querySelector(".search-results");
  content.innerHTML = " ";
}

// play list clear button
function clearListButton() {
  let clearBtn = document.querySelector(".clear-btn");
  clearBtn.addEventListener('click', function () {
    localStorage.clear();
    sideBar.innerHTML = "";
  });

}

clearListButton();


