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
          document.getElementById('entireForm').innerHTML = createPage1(idAndNames);
        }
      }
    };
    xhr.send();
  });

function createPage1(idAndNames){
  return `
      <div>
      These are the ID and names on that invitation ID:<br/>
      ${idAndNames} <br/>
      </div>
  `;
}