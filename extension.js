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
		{ name: 'pacakge.json', content: `{
}`},
		{ name: '', content: ``},
		{ name: '', content: ``}
	];

	filesToCreate.forEach(file => {
		const filePath = path.join(folderPath, file.name);

		fs.writeFile(filePath, file.content, (err) => {
			if (err) {
				vscode.window.showErrorMessage("Error creating file ${file.name}: ${err.message}");
			}
		});
	});

	vscode.window.showInformationMessage('Files for Chrome extension created.');
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
