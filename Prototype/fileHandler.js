/* Global Variables */
let Data = [];
let Header = [];
let JSONData = {};

/* --- File Manipulation --- */
let reader = new FileReader();
//let Writer = new FileWriter(); TODO

/* ----- DOM Manipulation ----- */

/* --- Read File --- */
let fileInput = document.querySelector("#fileInput");
let delimiter = document.querySelector("#delimiter");
let textMarker = document.querySelector("#text-marker");

fileInput.addEventListener("change", function() {
	reader.readAsText(this.files[0], "UTF-8");
  reader.onload = function (evt) {

  		// TODO lodash für map beim Laden?!

  		// Get full content string from the file
  		let content = evt.target.result;

  		// split by carriage return for rows
      let rows = content.split("\n");
      // include always depends on both cr AND lf
      // => split by line feed also (order important)
      rows = content.split("\r");

      // get Columns for each row
      Data = rows.map(row => splitRow(row, delimiter.value, textMarker.value));        			
      // Show table with or without header
      updateTable(Data, [], useOwnHeaderDef.checked);
  }
  reader.onerror = function (evt) {
      console.log("Error reading file");
  }
});

/* --- Change Headline Usage --- */ 
let headlineUsage = document.querySelector("#headline-usage");
let showHeadlineFields = document.querySelector("#show-headline-fields");
let headlineFields = document.querySelector("#headline-fields");
let useHeadline = document.querySelector("#use-headline");
let useOwnHeaderDef = document.querySelector("#use-own-header");

headlineUsage.addEventListener("change", () => {
	if (useHeadline.checked) {
		showHeadlineFields.style.display = "none";
		// Update Table if data available
		if (Data.length > 0) {
			updateTable(Data, [], false);
		}
	}
	else if (useOwnHeaderDef.checked) {
		// Default count of colums
		let colCount = 5;
		// Data available?
		if(Data.length > 0) {
			// Colums for all available colums
			colCount = Data[0].length;
		}

		// Remove all previous fields
		while (headlineFields.hasChildNodes()) {
			headlineFields.removeChild(headlineFields.firstChild);
		}

		// Add all labels and input fields
		for(let i = 0; i < colCount; i++) {
			let label = document.createElement("label");
			label.setAttribute("for", "headline-" + i);
			label.innerHTML = "Headline " + parseInt(i+1);
			headlineFields.appendChild(label);
			let input = document.createElement("input");
			input.setAttribute("type", "text");
			input.setAttribute("id", "headline-" + i);
			if(Header[i]){
				input.setAttribute("value", Header[i]);
			}			
			headlineFields.appendChild(input);
		}

		showHeadlineFields.style.display = "block";

		// Update Table if data available
		if (Data.length > 0) {
			updateTable(Data, Header, true);
		}		
	}
});

/* --- Buttons --- */

let applyButton = document.querySelector('#apply-changes');

applyButton.addEventListener("click", function() {
	// Get all Headline Inputs
	let headlines = Array.from(document.querySelectorAll("#headline-fields input"));
	// Empty Global Headlines array
	Header = [];
	// Fill Global Headlines array with new values
	headlines.forEach(headline => Header.push(headline.value));

	// Update Table if data available
	if (Data.length > 0) {
		updateTable(Data, Header, true);
	}	
});

let createJsonButton = document.querySelector('#create-json');

createJsonButton.addEventListener("click", function() {
	JSONData = updateJSON(Data, Header, useOwnHeaderDef.checked);
});

/* --- Updates --- */

let delimiterInput = document.querySelector("#delimiter");

delimiterInput.addEventListener("change", function() {
	// Change Data for new delimiter

	// Table available?
	if (document.querySelector('#result-table').innerHTML !== "") {
		console.log("changing Table");
		updateTable(Data, Header, useOwnHeaderDef.checked);
	}
	// JSON Object Data defined?
	if (Object.keys(JSONData).length !== 0) {
		console.log("changing JSON");
		JSONData = updateJSON(Data, Header, useOwnHeaderDef.checked);
	}

});

let textMarkerSelect = document.querySelector("#text-marker");

textMarkerSelect.addEventListener("change", function() {

});