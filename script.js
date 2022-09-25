const API_URL = "https://dummy-apis.netlify.app/api/contact-suggestions?count=";
const contactListElement = document.querySelector(".contact-list");
const currentInvitionsElement = document.querySelector(".current-invitions");
const currentInvitionsElementText = currentInvitionsElement.textContent;

// state
let contacts = [];

async function getDataFromApi() {
  const response = await fetch(API_URL + 8);
  contacts = await response.json();
}

function generateName(nameData) {
  let output = "";

  if (nameData?.title) {
    output += nameData.title;
  }

  if (nameData?.first) {
    output += " " + nameData.first;
  }

  if (nameData?.last) {
    output += " " + nameData.last;
  }

  return output;
}

function getPendingCount() {
  let count = 0;

  for (let contact of contacts) {
    if (contact.isPending) {
      count++;
    }
  }

  return count;
}

function generateInivitationText(n) {
  return n > 0 ? `${n} pending invitation` : currentInvitionsElementText;
}

function updateCurrentInvitionsElementText(text) {
  currentInvitionsElement.textContent = text;
}

async function addNewPersonFromApi() {
  const response = await fetch(API_URL + 1);
  return await response.json();
}

function totalPendingTextUpdate() {
  const currentCount = getPendingCount();
  const invitationsText = generateInivitationText(currentCount);
  updateCurrentInvitionsElementText(invitationsText);
}

async function removePerson(index) {
  contacts = contacts.filter((item, i) => i !== index);

  const newPerson = await addNewPersonFromApi();
  contacts.push(newPerson[0]);

  render();
}

function generatePersonHtml(
  index,
  { picture, name, title, mutualConnections, backgroundImage, isPending }
) {
  return `<li class="contact-person" style="background-image: url(${backgroundImage}?i=${index})">
      <button class="btn-remove-person">x</button>
      <img src="${picture}" alt="Bild von Name der Person">
      <h2>${generateName(name)}</h2>
      <p>${title}</p>
      <p>${mutualConnections} Mutual connect</p>
      <button class="toggle-connect">${
        isPending ? "Pending" : "Connect"
      }</button>
    </li>`;
}

function render() {
  totalPendingTextUpdate();
  contactListElement.innerHTML = "";

  let output = "";
  let index = 0;

  for (let contact of contacts) {
    output += generatePersonHtml(index, contact);
    index++;
  }

  document.querySelector(".contact-list").innerHTML = output;

  document.querySelectorAll(".btn-remove-person").forEach((button, index) => {
    button.addEventListener("click", () => removePerson(index));
  });

  document.querySelectorAll(".toggle-connect").forEach((button, index) => {
    button.addEventListener("click", () => toggleConnection(index));
  });
}

function toggleConnection(index) {
  contacts[index].isPending = !contacts[index].isPending;

  render();
}

async function initApp() {
  await getDataFromApi();
  render();
}

initApp();
