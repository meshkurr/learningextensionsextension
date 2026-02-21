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
