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
        isRSVPd = sheet.getRange(i, 4).getValue();
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


// submission
function doPost(e) {
 
  return ContentService.createTextOutput('Success');
}