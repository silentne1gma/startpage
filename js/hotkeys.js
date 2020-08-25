//A dictionary containing the sites with the corresponding hotkeys
const sites = {};

let visible = false;
let categoryToEdit;

function getCategories() {
	let categories = getCategoriesFromLocalStorage();

	if (categories === null) {
		let categories = {
			cat1: {},
			cat2: {},
			cat3: {},
			cat4: {},
		};
		setCategoriesOnLocalStorage(categories);
		return categories;
	}

	return categories;
}

function getCategoriesFromLocalStorage() {
	let categoriesJSON = localStorage.getItem("categoriesJSON");
	categoriesJSON = JSON.parse(categoriesJSON);
	return categoriesJSON;
}

function setCategoriesOnLocalStorage(categories) {
	let categoriesJSON = JSON.stringify(categories);
	localStorage.setItem("categoriesJSON", categoriesJSON);
	return categories;
}

// loop thro the categories and dynamically fill the sites object
function getSites() {
	let categories = getCategories();

	for (category in categories) {
		let category_card = document.getElementById(category);
		const category_sites = {};
		for (site in categories[category]) {
			for (hotkey in categories[category][site]) {
				let link = categories[category][site][hotkey];
				sites[hotkey] = link;
				category_sites[site] = link;
			}
		}
		for (category_site in category_sites) {
			const link = category_sites[category_site];
			category_card.innerHTML += `<li><a href=${link}>${category_site}</a><div class="remove button" onclick="removeSite('${category_site}')">
			<img src="img/minus.svg" alt="">
		</div></li>`;
		}
	}
}

function clearSites() {
	const categories = getCategoriesFromLocalStorage();

	for (category in categories) {
		let category_card = document.getElementById(category);
		const category_sites = {};
		category_card.innerHTML = "";
	}
}

function showEditCategories() {
	const editPanels = document.getElementsByClassName("edit");

	for (let i = 0; i < editPanels.length; i++) {
		editPanels[i].style.display = "flex";
	}
	visible = true;
}

function hideEditCategories() {
	const editPanels = document.getElementsByClassName("edit");

	for (let i = 0; i < editPanels.length; i++) {
		editPanels[i].style.display = "none";
	}
	visible = false;
}

function editCategories() {
	if (visible) {
		enableHotkeys();
		hideEditCategories();
	} else {
		disableHotkeys();
		showEditCategories();
	}
}

function showAddPanel(category) {
	categoryToEdit = category;
	let ninja = document.getElementById("ninja");
	let addPanel = document.getElementById("addPanel");
	ninja.style.display = "flex";
	addPanel.style.display = "flex";
}

function hidePanels() {
	let ninja = document.getElementById("ninja");
	let addPanel = document.getElementById("addPanel");
	let addSite = document.getElementById("addSiteNameInput").value;
	let url = document.getElementById("siteUrlInput").value;
	let hotkey = document.getElementById("siteHotkeyInput").value;
	addSite.value = null;
	url.value = null;
	hotkey.value = null;
	ninja.style.display = "none";
	addPanel.style.display = "none";
	categoryToEdit = null;
}

function removeSite(name) {
	let categories = getCategories();
	for (category in categories) {
		delete categories[category][name];
	}
	setCategoriesOnLocalStorage(categories);
	clearSites();
	getSites();
	hidePanels();
}

function addSite() {
	let categories = getCategories();
	let siteName = document.getElementById("addSiteNameInput").value;
	let url = document.getElementById("siteUrlInput").value;
	let hotkey = document.getElementById("siteHotkeyInput").value;
	let dict = {};
	dict[hotkey] = url;
	categories[categoryToEdit][siteName] = dict;
	categoryToEdit = null;
	setCategoriesOnLocalStorage(categories);
	clearSites();
	getSites();
	hidePanels();
}
//  Get the ASCII key code (int) of the key pressed then convert it to (string) the corresponding letter name
function checkHotkey(event) {
	let pressed_key = String.fromCharCode(event.keyCode);
	//event.preventDefault();
	let keys = Object.keys(sites);
	if (keys.includes(pressed_key)) {
		//  Lookup the corresponding key value in the dictionary
		let target_site = sites[pressed_key];
		//  Change window location to the corresponding site
		window.location.href = target_site;
	}
}
function enableHotkeys() {
	window.addEventListener("keydown", checkHotkey);
}
function disableHotkeys() {
	window.removeEventListener("keydown", checkHotkey);
}

enableHotkeys();
getSites();
