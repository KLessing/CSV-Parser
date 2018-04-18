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
// Updated die Tabelle
function updateTable(data, header, useHeader) {
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
// Returns JSON Object for Data
function updateJSON(data, header, useHeader) {
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

	// TODO Datei?!
	return arrayOfDataObjects;
}