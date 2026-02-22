import * as vscode from 'vscode';

export async function SelectFilesToShare() {
    const selectedFiles = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: true,
        canSelectMany: true,
        openLabel: "Select Files to Share"
    });

    if (!selectedFiles || selectedFiles.length == 0) {
        vscode.window.showInformationMessage("No files selected to share");
        return;
    }
    for (const file of selectedFiles) {
        console.log(file.fsPath)
    }
    vscode.window.showInformationMessage(`Selected ${selectedFiles.length} files to share`);
}
async function getWorkspaceItems(): Promise<vscode.QuickPickItem[]> {
    const items: vscode.QuickPickItem[] = [];

    const folders = vscode.workspace.workspaceFolders;
    if (!folders) {
        return items;
    }

    for (const folder of folders) {
        await scanDirectory(folder.uri, items, folder.uri);
    }

    return items;
}
async function scanDirectory(
    dir: vscode.Uri,
    items: vscode.QuickPickItem[],
    root: vscode.Uri
) {
    const entries = await vscode.workspace.fs.readDirectory(dir);

    for (const [name, type] of entries) {
        const uri = vscode.Uri.joinPath(dir, name);

        if (name === 'node_modules' || name === '.git') {
            continue;
        }
        // Show path relative to workspace root
        const relative = vscode.workspace.asRelativePath(uri);

        if (type === vscode.FileType.Directory) {
            items.push({
                label: `$(folder) ${relative}`,
                description: 'Folder'
            });

            // Recurse into folders
            await scanDirectory(uri, items, root);
        }
        else if (type === vscode.FileType.File) {
            items.push({
                label: `$(file) ${relative}`,
                description: 'File'
            });
        }
    }
}
// Depricated
export async function SelectLocalFiles() {
    const items = await getWorkspaceItems();

    const selections = await vscode.window.showQuickPick(items, {
        canPickMany: true,
        placeHolder: 'Select files or folders'
    });

    if (!selections || selections.length === 0) {
        vscode.window.showInformationMessage('Nothing selected');
        return;
    }

    // Convert selections to a simple list of paths
    const selectedPaths = selections.map(s => s.label.replace(/^\$\([^)]+\)\s*/, ''));

    console.log(selectedPaths);

    vscode.window.showInformationMessage(
        `Selected ${selectedPaths.length} item(s)`
    );
}