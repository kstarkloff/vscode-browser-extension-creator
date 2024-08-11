// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

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
	"version": "1.0",
	"permissions": [
	],
	"action": {
			"default_popup": "popup.html"
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

	vscode.window.showInformationMessage('Files for Chrome extension created at ' + folderPath);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
