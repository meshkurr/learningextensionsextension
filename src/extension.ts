// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SelectFilesToShare } from './file-selection/file-selection'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "learningextensionsextension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('learningextensionsextension.goodbyeworld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Goodbye World from LearningExtensionsExtension!');
	});
	const HelloWorldCommand = vscode.commands.registerCommand('learningextensionsextension.helloworld', () => {
		vscode.window.showInformationMessage('Hello World from LearningExtensionsExtension!');
	});
	const TestError = vscode.commands.registerCommand('learningextensionsextension.testerror', () => {
		vscode.window.showErrorMessage('This is a test error from LearningExtensionsExtension!');
	});
	const TestOpenDialog = vscode.commands.registerCommand('learningextensionsextension.testopendialog', async () => {
		SelectFilesToShare();
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(HelloWorldCommand);
	context.subscriptions.push(TestError);
	context.subscriptions.push(TestOpenDialog);
}

// This method is called when your extension is deactivated
export function deactivate() { }
