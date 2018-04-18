/* ----- Funtions ----- */ 

// split rows with text Markers
// (for example "Religion (ev, kath)" belongs together)
// by the delimiter
function splitRow(row, delimiter, textMarker) {
	let res = [];
	if (!row.includes(textMarker)) {
		// Split rows without text Marker directly
		res = row.split(delimiter);
	} 
	else {
		// Split by text Marker
		res = row.split(textMarker);
		// Split by seperator only without text Marker
		res = res.map(splitter => {
			// Remove delimiter at the end and split
			if (splitter.endsWith(delimiter)) {
			 splitter = splitter.slice(0, -1).split(delimiter);
			}
			// Remove delimiter at the start and split
			else if (splitter.startsWith(delimiter)){
				splitter = splitter.replace(delimiter, "").split(delimiter);
			}
			// Otherwise don't split
			return splitter;
		});
		// Concat the subArrays back into one Array
		// (apply concats empty array as "this" param
		// with all values in the array param)
		res = res.concat.apply([], res)
	}						
	return res;
}

// data = result Daten
// header = header falls eigener
// use Header = true, wenn eigener header benutzt werden soll
function showResultAsTable(data, header, useHeader) {
	let table = document.querySelector("#result-table");
	let headerData = [];
	let index = 0;

	if (useHeader) {
		headerData = header;
	}
	else {
		headerData = data[0];
		index = 1;
	}

	// Remove all table nodes
	while (table.hasChildNodes()) {
		table.removeChild(table.firstChild);
	}

	let tableHeader = document.createElement("thead");
	tableHeader.appendChild(document.createElement("tr"));

	headerData.forEach(header => {
		let currentCol = document.createElement("th");
		currentCol.innerHTML = header;
		tableHeader.appendChild(currentCol);
	});

	table.appendChild(tableHeader);

	let tableBody = document.createElement("tbody");
	// iterate rows
	for(index; index < data.length; index++) {
		tableBody.appendChild(document.createElement("tr"))
		// iterate cols
		data[index].forEach(data => {
			let currentCol = document.createElement("td");
			currentCol.innerHTML = data;
			tableBody.appendChild(currentCol);
		});
	}
	table.appendChild(tableBody);
}

// data = result Daten
// header = header falls eigener
// use Header = true, wenn eigener header benutzt werden soll
function exportAsJSON(data, header, useHeader) {
	let arrayOfDataObjects = [];
	let currentDataObject = {};
	let headerData = [];
	let rowIndex = 0;
	let colIndex = 0;

	if (useHeader) {
		headerData = header;
	}
	else {
		headerData = data[0];
		rowIndex = 1;
	}
	
	for(rowIndex; rowIndex < data.length; rowIndex++) {
		currentDataObject = {};
		for(colIndex = 0; colIndex < data[rowIndex].length; colIndex++){
			currentDataObject[headerData[colIndex]] = data[rowIndex][colIndex];
		}
		arrayOfDataObjects.push(currentDataObject);
	}

	console.log(arrayOfDataObjects);
}



/* -------------------------------------------------------- */

/* Global Variables */
let Data = [];
let Header = [];

/* --- File Manipulation --- */
let reader = new FileReader();
//let Writer = new FileWriter(); todo

/* ----- DOM Manipulation ----- */

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
      showResultAsTable(Data, [], useOwnHeaderDef.checked);
  }
  reader.onerror = function (evt) {
      console.log("Error reading file");
  }
});


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
			showResultAsTable(Data, [], false);
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
			showResultAsTable(Data, Header, true);
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
		showResultAsTable(Data, Header, true);
	}	
});

let createJsonButton = document.querySelector('#create-json');

createJsonButton.addEventListener("click", function() {
	exportAsJSON(Data, Header, useOwnHeaderDef.checked);
});