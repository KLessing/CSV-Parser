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

// return the max count of cols from an array or the default value
// when data is undefined
function getMaxColCount(data, defaultValue) {
	let maxCount = 0;
	if (data.length > 0) {
		data.forEach(row => row.length > maxCount ? maxCount = row.length : row);
	}
	else {
		maxCount = defaultValue;
	}
	console.log(maxCount);
	return maxCount;
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

	return arrayOfDataObjects;
}

const readUploadedFileAsText = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};

function dataStringToArray(dataString) {
		// split by carriage return for rows
    let rows = dataString.split("\n");
    // include always depends on both cr AND lf
    // => split by line feed also (order important)
    rows = dataString.split("\r");
    // get Columns for each row and save Data global
    return rows.map(row => splitRow(row, delimiter.value, textMarker.value));        			
}

const handleDataUpload = async (event) => {
  const file = event.files[0];

  try {
  	// Wait until the File is read
    const dataString = await readUploadedFileAsText(file);  

    // Update Data Array
    Data = dataStringToArray(dataString);

    // Update JSON
    JSONData = updateJSON(Data, Header, useOwnHeaderDef.checked);

    // Show table with or without header
    updateTable(Data, [], useOwnHeaderDef.checked);

  } catch (e) {
    console.warn(e.message)
  }
}