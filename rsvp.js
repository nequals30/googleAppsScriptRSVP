
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    var name = this.elements.name.value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec?name=' + name, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        var idAndNames = xhr.responseText;
        if (idAndNames === "Name not found") {
          document.getElementById('output').innerHTML = "<div>Error: Couldn't find guest name.</div>";
        } else if (idAndNames === "Already RSVPd"){
          document.getElementById('output').innerHTML = `<div>Error: Already RSVP'd.</div>`;
        } else {
          collectResponses(idAndNames);
        }
      }
    };
    xhr.send();
  });

function collectResponses(idAndNames){
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

  // Write HTML and checkboxes for each person
  document.getElementById('entireForm').innerHTML = `
      <div>
      We found your RSVP!<br/><br/>
      ${data.map(
          person => `${person.name}: <input type="checkbox" id="${person.id}" /> Attending?<br/><br/>`
        ).join('')}
      <button id="submit">Submit</button>
      </div>
  `;

  // Submit button code
  document.getElementById('submit').addEventListener('click', () => {
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
      console.log("Success!");
    } else {
      return; // error
    }
  };
  xhr.onerror = function() {
    return; // Request failed due to a network error or other issue
  };
  xhr.send(JSON.stringify(data));
}