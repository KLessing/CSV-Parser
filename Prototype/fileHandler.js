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

function showResultAsTable(data) {
	let table = document.querySelector("#result-table");

	let tableHeader = document.createElement("thead");
	tableHeader.appendChild(document.createElement("tr"));
	data[0].forEach(header => {
		let currentCol = document.createElement("th");
		currentCol.innerHTML = header;
		tableHeader.appendChild(currentCol);
	});
	table.appendChild(tableHeader);

	let tableBody = document.createElement("tbody");
	for(let i = 1; i < data.length; i++) {
		tableBody.appendChild(document.createElement("tr"))
		data[i].forEach(data => {
			let currentCol = document.createElement("td");
			currentCol.innerHTML = data;
			tableBody.appendChild(currentCol);
		});
	}
	table.appendChild(tableBody);
}


function exportAsJSON(data) {}

function exportsAsCSV(data) {}



/* -------------------------------------------------------- */

/* Global Variables */
let Data = [];
let Header = [];

let reader = new FileReader();
let fileInput = document.querySelector("#fileInput");
let delimiter = document.querySelector("#delimiter");
let textMarker = document.querySelector("#text-marker");

fileInput.addEventListener("change", function() {

	reader.readAsText(this.files[0], "UTF-8");

  reader.onload = function (evt) {
  		// TODO lodash für map beim Laden?!
  		let content = evt.target.result;
  		// split line feed for rows
      let rows = content.split("\r");
      console.log(rows);
      let cols = rows.map(row => splitRow(row, delimiter.value, textMarker.value));        			
      console.log(cols);

      Data = cols;

      showResultAsTable(cols);
  }
  reader.onerror = function (evt) {
      console.log("error reading file");
  }
});


let headlineUsage = document.querySelector("#headline-usage");
let showHeadlineFields = document.querySelector("#show-headline-fields");
let headlineFields = document.querySelector("#headline-fields");
let useHeadline = document.querySelector("#use-headline");
let useData = document.querySelector("#use-data");

headlineUsage.addEventListener("change", () => {
	if (useHeadline.checked) {
		showHeadlineFields.style.display = "none";
	}
	else if (useData.checked) {
		// Default count of Colums
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

		for(let i = 0; i < colCount; i++) {
			let label = document.createElement("label");
			label.setAttribute("for", "x")
			label.innerHTML = "Headline " + parseInt(i+1);
			headlineFields.appendChild(label);
			let input = document.createElement("input");
			input.setAttribute("type", "text");
			input.setAttribute("id", "x");
			headlineFields.appendChild(input);
		}


		showHeadlineFields.style.display = "block";
	}
});
