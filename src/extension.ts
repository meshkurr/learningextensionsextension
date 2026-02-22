import * as vscode from 'vscode';
import { SharedFileProvider, FileItem } from './file_selection/shared_file_provider';

export function activate(context: vscode.ExtensionContext) {

	// This line of code will only be executed once when your extension is activated
	console.log('Attempting to register TreeView...');

	console.log('Congratulations, your extension "learningextensionsextension" is now active!');

	// const rootPath = (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0)
	// 	? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

	// The crash is happening right here!
	const treeProvider = new SharedFileProvider(rootPath, context);

	const view = vscode.window.createTreeView('fileShareSelector', {
		treeDataProvider: treeProvider
	});
	context.subscriptions.push(view);

	// Handle checkbox state changes
	view.onDidChangeCheckboxState(async e => {
		const sharedFiles: string[] = context.globalState.get('sharedFiles', []);
		for (const [item, state] of e.items) {
			const fileItem = item as FileItem;
			if (state === vscode.TreeItemCheckboxState.Checked) {
				if (!sharedFiles.includes(fileItem.fsPath)) {
					sharedFiles.push(fileItem.fsPath);
				}
			} else {
				const index = sharedFiles.indexOf(fileItem.fsPath);
				if (index > -1) {
					sharedFiles.splice(index, 1);
				}
			}
		}
		await context.globalState.update('sharedFiles', sharedFiles);
		treeProvider.refresh();
	});

	console.log('TreeView registered successfully.');
}

// This method is called when your extension is deactivated
export function deactivate() { }
