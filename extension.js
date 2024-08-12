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
	let disposable = vscode.commands.registerCommand('browser-extension-creator.chrome', createChromeExtensionFiles);

	context.subscriptions.push(disposable);
}

async function createChromeExtensionFiles() {
	const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

	if (!folderPath) {
		vscode.window.showErrorMessage("No workspace found.");
		return;
	}

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

	filesToCreate.forEach(file => {
		const filePath = path.join(folderPath, file.name);

		fs.writeFile(filePath, file.content, (err) => {
			if (err) {
				vscode.window.showErrorMessage("Error creating file ${file.name}: ${err.message}");
			}
		});
	});

	// create images subdirectory
	const imagesPath = path.join(folderPath, "images");

	if (!fs.existsSync(imagesPath)) {
		fs.mkdirSync(imagesPath);
	}

	// create png pictures
	const png16 = new PNG({width: 16, height: 16});
	const png48 = new PNG({width: 48, height: 48});
	const png128 = new PNG({width: 128, height: 128});

	createPngWithColor(png16, path.join(imagesPath, 'icon16.png'), 255, 0, 0, 255);
	createPngWithColor(png48, path.join(imagesPath, 'icon48.png'), 255, 0, 0, 255);
	createPngWithColor(png128, path.join(imagesPath, 'icon128.png'), 255, 0, 0, 255);

	vscode.window.showInformationMessage('Files for Chrome extension created at ' + folderPath);
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

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
