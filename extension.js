// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { PNG } = require('pngjs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand('browser-extension-creator.chrome', createChromeExtensionFiles));

	context.subscriptions.push(
		vscode.commands.registerCommand('browser-extension-creator.firefox', createFirefoxExtensionFiles));
}

async function createChromeExtensionFiles() {

	const filesToCreate = [
		{ name: 'manifest.json', content: `{
	"manifest_version": 3,
	"name": "My extension",
	"description": "Description of my extension",
	"version": "1.0",
	"permissions": [
	],
	"action": {
			"default_popup": "popup.html",
			"default_icon": {
				"16": "images/icon16.png",
				"48": "images/icon48.png",
				"128": "images/icon128.png"
			}
	}
}`},
		{ name: 'popup.html', content: `<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>My extension</title>
	</head>
	<body>

	<script src="popup.js"></script>
	</body>
</html>`},
		{ name: 'popup.js', content: ``}
	];

	try {
		createFiles(filesToCreate);

		createImage(16);
		createImage(48);
		createImage(128);

		vscode.window.showInformationMessage('Files for Chrome extension created.');
	} catch (err) {
		vscode.window.showErrorMessage("An error occurred with error message '" + err + "'");
	}
}

async function createFirefoxExtensionFiles() {
	const filesToCreate = [
		{ name: 'manifest.json', content: `{
  "manifest_version": 2,
  "name": "Mein erstes Add-on",
  "version": "1.0",
  "description": "Ein einfaches Firefox-Add-on",
  "icons": {
    "48": "images/icon48.png"
  },
  "browser_action": {
    "default_popup": "popup.html",
    "default_icon": "images/icon48.png"
  },
  "background": {
    "scripts": ["background.js"]
  },
  "permissions": [
    "storage",
    "activeTab"
  ]
}`}, 
			{ name: 'popup.html', content: `

`},
			{ name: 'popup.js', content: ``},
			{ name: 'background.js', content: ``}
	];

	try {
		createFiles(filesToCreate);

		createImage(48);

		vscode.window.showInformationMessage("Files for Firefox extension created.");
	} catch (err) {
		vscode.window.showErrorMessage("An error occurred with error message '" + err + "'");
	}
}

function createPngWithColor(png, image_path, red, green, blue, alpha) {
	for (let y = 0; y < png.height; y++) {
		for (let x = 0; x < png.width; x++) {
			const idx = (png.width * y + x) << 2;

			png.data[idx] = red;
			png.data[idx + 1] = green;
			png.data[idx + 2] = blue;
			png.data[idx + 3] = alpha;
		}
	}

	png.pack().pipe(fs.createWriteStream(image_path))
		.on('finish', () => {});
}

async function createFiles(filesToCreate) {
	const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

	if (!folderPath) {
		throw "No workspace found.";
	}

	filesToCreate.forEach(file => {
		const filePath = path.join(folderPath, file.name);

		fs.writeFile(filePath, file.content, (err) => {
			if (err) {
				throw "Error creating file ${file.name}: ${err.message}.";
			}
		})
	});
}

async function createImage(size) {
	if (typeof size !== 'number') {
		throw "Cannot create picture. Given size was not a number.";
	}

	const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

	if (!folderPath) {
		throw "No workspace found.";
	}

	const imagesPath = path.join(folderPath, "images");

	if (!fs.existsSync(imagesPath)) {
		fs.mkdirSync(imagesPath);
	}

	const png = new PNG({width: size, height: size});

	createPngWithColor(png, path.join(imagesPath, "icon" + size + ".png"), 255, 0, 0, 255);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
