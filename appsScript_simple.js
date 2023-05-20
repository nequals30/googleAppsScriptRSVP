// This should be pasted into the Apps Script

function doGet(e) {
  var inputName = e.parameter.name;
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var nameFound = false;
  var id;

  inputName = inputName.toLowerCase();
  isRSVPd = "0"

  // loop through list of all names to check if it matches input name
  for (var i = 2; i <= lastRow; i++) {
    var thisName = sheet.getRange(i, 1).getValue().toString().toLowerCase();
    if (thisName === inputName) {
      nameFound = true;
      id = sheet.getRange(i, 2).getValue();
      isRSVPd = sheet.getRange(i, 3).getValue();
      break;
    }
  }

  // already RSVPd?
  if (isRSVPd=="1"){
    return ContentService.createTextOutput("Already RSVPd");
  }

  // loop through the names again to find other names with that ID
  // turn them into a comma separated list
  var outNames = ""
  for (var i = 2; i <= lastRow; i++) {
    var thisID = sheet.getRange(i, 2).getValue()
    if (thisID == id) {
      outNames = outNames + "," + sheet.getRange(i, 1).getValue().toString()
    }
  }

  // output the results back to the form. will be comma delimited, like: id, name1, name2
  var out;
  if (nameFound) {
    out = id.toString() + outNames
  } else {
    out = 'Name not found'
  }

  return ContentService.createTextOutput(out);
}

function doPost(e) {
// read input
var data = JSON.parse(e.postData.contents);
var inviteID = data[0].inviteID;

// 1. append to responses spreadsheet
var sheet_responses = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('responses');
for(var i = 0; i < data.length; i++) {
  var row = [
      data[i].inviteID,
      data[i].name,
      data[i].attending
  ];
  sheet_responses.appendRow(row);
}

// 2. mail success email
var allNamesStr = data.map(function(obj) {return obj.name;}).join(' / ');
var allDataStr = "Invite ID: " + inviteID + "<br/><br/>" + data.map(function(obj) {
      return "Name: " + obj.name + ", Attending: " + obj.attending;
  }).join('<br/>');

  MailApp.sendEmail({
  to: 'YOUR_EMAIL@gmail.com',
  subject: "RSVP submitted: " + allNamesStr,
  htmlBody: allDataStr
});

// 3. Set guest's RSVP status to "1"
var sheet_invites = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('invites');
for (var i = 2; i <= sheet_invites.getLastRow(); i++) {
  var thisID = sheet_invites.getRange(i, 2).getValue().toString();
  if (thisID === inviteID) {
      sheet_invites.getRange(i, 3).setValue("1");
  }
}

return ContentService.createTextOutput('Success');
}