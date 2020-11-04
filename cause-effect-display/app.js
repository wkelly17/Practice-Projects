/* Cause and effect from Florin Pop  Started on: Monday November 02, 2020 03:02PM
	idea https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Cause-Effect-App.md */

const list = document.querySelector('.list-pane');
const detailsPane = document.querySelector('.details-pane');

//@? I know how to get json back from using async await, (i.e. my fashion bot weather), which is what I've done here.  Not as sure how to separate concerns of displaying and fetching data just using simple promise chaining or if it's possible. (the async await I know I can just get the returned result)
//todo: I also may see about getting cross linked data.  Not sure how as much. ie photos or other stuff in the api.
async function getUsers() {
  let response = await fetch('https://jsonplaceholder.typicode.com/users');
  let users = await response.json();
  // console.log(users);
  return users;
}

function generateListHTML(user) {
  return `
  <div class="user" tabindex="0">
  <h4 class="name">${user.name}</h4>
  <span class="username">Username: @${user.username}</span>
  </div>
  `;
}
function detailHTML(user) {
  return `
  <div class="user-details">
  <h2>${user.name}</h2>
  <p>${user.name} lives at ${user.address.city}, ${user.address.street}, ${user.address.suite}, ${user.address.zipcode}.
  </p>
  <p>
  ${user.name} can be connected at ${user.email} or at ${user.phone}. Their website is ${user.website}
    and they work at ${user.company.name}.
  </p>
</div>
  `;
}

async function moreInfo(event) {
  // event.stopPropagation();
  console.log('working on getting you that info');
  console.dir(this);
  let name = this.firstElementChild.innerText;
  console.log(name);

  let personDetails = await getUsers();
  let requestedPerson = personDetails.filter(
    (person) => person.name == name
  )[0];
  console.log(requestedPerson);
  detailsPane.innerHTML = detailHTML(requestedPerson);
}

function generateUserList(users) {
  console.log(users);
  // users.map(generateHTML)
  list.innerHTML = `
  <div class="users">
${users.map(generateListHTML).join('')}
</div>
`;
  const listedUsers = document.querySelectorAll('.user');
  //must select here and not at top of document to actually capture them.
  console.log(listedUsers);
  listedUsers.forEach((user) => user.addEventListener('click', moreInfo));

  //@? Not sure if good or not, but hacky little click simulation I threw in so that you could tab down the divs and click enter
  listedUsers.forEach((user) => user.addEventListener('keyup', (event) => {
    console.log(event)
    if (event.code == "Enter") {
      user.click()
    }
  }));
}

getUsers()
  .then(generateUserList)
  .catch((e) => console.log(`Error: ${e}`));

// async function getAPIs() {
//   let response = await fetch("https://api.publicapis.org/entries")
//   let data = await response.json()
//   return data
// }

// function getAPIhtml(myAPI) {
//   return `<div class="my-api">
//       <div class="my-api-name">
//           <a href="${myAPI.Link}" target="_blank">${myAPI.API} (${myAPI.Category})</a>
//       </div>
//       <div class="my-api-description">${myAPI.Description}</div>
//       <div class="my-api-auth">Auth: ${myAPI.Auth ? myAPI.Auth : 'None'}</div>
//       <div class="my-api-https">HTTPS? ${myAPI.HTTPS}</div>
//   </div>`
// }

// function displayAPIs(myAPIs) {
//   let sampleAPI = myAPIs.entries[0]
//   myAPIs = myAPIs.entries //makes entries into array
//   document.body.innerHTML = `<div class="my-apis">
//       ${myAPIs.map(getAPIhtml).join('')}
//   </div>`
// }

// getAPIs()
//   .then(displayAPIs)
//   .catch(e => console.log(`Error: ${e}`))
