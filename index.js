const COHORT = "2310-GHP-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const parties = []

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", newParty);

function partyTime(str) {
    let time = str.slice(10);
    return time;
}

function partyDate(str) {
    let date = str.slice(0, 10);
    return date;
}

/**
 * Sync state with the API and rerender
 */
async function render() {
  const api_parties = await getParties(); // [{artist}, {artist}]
  parties.party = api_parties;
  renderParty();
}
render();

async function getParties() {
    try {
      const response = await
        fetch(API_URL);
      const responseJson = await response.json();
      const changedResponse = responseJson.data.map((party) => {
        party.time = partyTime(party.date);
        party.date = partyDate(party.date);
        return party
      })
      return changedResponse; 
    } catch (error) {
      console.error(error.message);
    }
}
async function delParty(party) {
    let new_url = API_URL + "/" + party.id
    try {
        const repsonse = await fetch(new_url, {
            method: "DELETE",  
        })
    } catch (error) {
        console.error(error);
    }
    render()
//fetch DELETE using new url
}

async function newParty(event) {
    event.preventDefault();
    let date = new Date(addPartyForm.PartyDate.value).toISOString()
        try {
          const response = await fetch(API_URL, {
          method: "POST",
          headers: {"Content-Type": "application/json" },
          body: JSON.stringify({
            name: addPartyForm.PartyName.value,
            date: date,
            location: addPartyForm.PartyLocation.value,
            description: addPartyForm.PartyDescriptions.value,
            }),
          });
          if (!response.ok) {
            throw new Error ("Failed to create party");
          }
          render();
          } catch (error) {
              console.error(error);
        }
}

function renderParty() {

if (!parties.party.length) {
partyList.innerHTML = "<li>No parties.</li>";
return;
}

const partyInfo = parties.party.map((party) => {
const li = document.createElement("li");
li.innerHTML = `
    <h2>${party.name}</h2>
    <p>${party.date}</p>
    <p>${party.time}</p>
    <p>${party.location}</p>
    <p>${party.description}</p>
` ;
const deleteButton = document.createElement("button");
deleteButton.addEventListener("click", function(event) { delParty(party)}); //wrappped in an anon function//
deleteButton.textContent = "Delete"
li.appendChild(deleteButton)
return li;
});

partyList.replaceChildren(...partyInfo);
}