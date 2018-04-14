	//$( document ).ready(function() {

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

		function showResult(data) {
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

		/* -------------------------------------------------------- */

		let reader = new FileReader();
		let fileInput = document.querySelector("#fileInput");
		let delimiter = document.querySelector("#delimiter");
		let textMarker = document.querySelector("#textMarker");

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

	        showResult(cols);
	    }
	    reader.onerror = function (evt) {
	        console.log("error reading file");
	    }
		});

	//});