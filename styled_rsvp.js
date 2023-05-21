
document.getElementById('form').addEventListener('submit', function(event) {
    document.getElementById('submit').classList.add('is-loading');
    event.preventDefault();
    var name = this.elements.name.value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec?name=' + name, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        document.getElementById('submit').classList.remove('is-loading');
        var idAndNames = xhr.responseText;
        if (idAndNames === "Name not found") {
          document.getElementById('output').innerHTML = `<div class="notification is-danger">Couldn't find guest name.</div>`;
        } else if (idAndNames === "Already RSVPd"){
          document.getElementById('output').innerHTML = `<div class="notification is-danger">This guest has already submitted an RSVP.</div>`;
        } else {
          create_rsvpPage1(idAndNames);
        }
      }
    };
    xhr.send();
  });

function create_rsvpPage1(idAndNames){
  const data = [];
  const inputArray = idAndNames.split(',');
  const inviteID = inputArray.shift() || "NA";

  // Iterate through the remaining names and create an object for each person
  inputArray.forEach((name, index) => {
    if (name) {
      data.push({
        inviteID: inviteID,
        name: name,
        attending: 0,
        id: `person${index}` // checkbox id, so submit button can find it
      });
    }
  });

  document.getElementById('entireForm').innerHTML = `
  <div class="content">
      <p>We found your RSVP!</p>
      ${data.map(person => `
          <div class="card mb-4">
              <div class="card-content">
                  <p class="subtitle">${person.name}</p>
                  <div class="field">
                    <label class="checkbox">
                      <input type="checkbox" id="${person.id}">
                      <span class="ml-2">Attending?</span>
                    </label>
                  </div>
              </div>
          </div>
      `).join('')}
      <div class="field">
          <div class="control has-text-centered">
              <button id="submit" class="button is-link">Submit</button>
          </div>
      </div>
  </div>
`;

  // Submit button code
  document.getElementById('submit').addEventListener('click', () => {
    document.getElementById('submit').classList.add('is-loading');
    // write each person's attending value to "data"
    data.forEach(person => {
      person.attending = document.getElementById(person.id).checked ? 1 : 0;
    });

    submitForm(data);

    // Disable the submit button so people can't click on it multiple times
    document.getElementById('submit').disabled = true;
  });
}

function submitForm(data) {
  const url = 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec';
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200 && xhr.responseText === 'Success') {
      document.getElementById('submit').classList.remove('is-loading');
      document.getElementById('entireForm').innerHTML = `<div>Success!</div>`;
    } else {
      return; // error
    }
  };
  xhr.onerror = function() {
    return; // Request failed due to a network error or other issue
  };
  xhr.send(JSON.stringify(data));
}