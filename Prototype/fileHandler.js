/* Global Variables */
let Data = [];
let Header = [];
let JSONData = {};

/* --- File Manipulation --- */
let reader = new FileReader();

/* ----- DOM Manipulation ----- */

/* --- Read File --- */
let fileInput = document.querySelector("#fileInput");
let delimiter = document.querySelector("#delimiter");
let textMarker = document.querySelector("#text-marker");

fileInput.addEventListener("change", function() {
	handleDataUpload(this);
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
		updateHeadlineFields();
		
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

let showJsonButton = document.querySelector('#show-json');

showJsonButton.addEventListener("click", function() {
	console.log(JSONData);
});

/* --- Updates --- */

let delimiterInput = document.querySelector("#delimiter");
let changeEvent = new CustomEvent('change', {bubbles: true, cancelable: true});

function dataUpdate(){
	// Data available?
	if (Data.length !== 0) {
		// Trigger change Event to reload Data with new parameters
		fileInput.dispatchEvent(changeEvent);
	}

	if (useOwnHeaderDef.checked) {
		updateHeadlineFields();
	}
}

delimiterInput.addEventListener("change", function() {
	dataUpdate();
});

let textMarkerSelect = document.querySelector("#text-marker");

textMarkerSelect.addEventListener("change", function() {
	dataUpdate();
});