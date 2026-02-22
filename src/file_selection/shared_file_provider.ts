import * as fs from 'fs'
import * as vscode from 'vscode';
import * as path from 'path'

export class SharedFileProvider implements vscode.TreeDataProvider<FileItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<FileItem | undefined> = new vscode.EventEmitter<FileItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<FileItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined, private context: vscode.ExtensionContext) { }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: FileItem): vscode.TreeItem {
        const sharedFiles: string[] = this.context.globalState.get('sharedFiles', []);
        if (element.collapsibleState === vscode.TreeItemCollapsibleState.None) {
            element.checkboxState = sharedFiles.includes(element.fsPath) 
                ? vscode.TreeItemCheckboxState.Checked 
                : vscode.TreeItemCheckboxState.Unchecked;
        }
        return element;
    }
    async getChildren(element?: FileItem): Promise<FileItem[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No workspace open');
            return [];
        }

        // Determine which directory to read
        const folderPath = element ? element.fsPath : this.workspaceRoot;

        try {
            return this.readDirectory(folderPath);
        } catch (err) {
            console.error(err);
            return [];
        }
    }
    private readDirectory(dirPath: string): FileItem[] {
        // Need to make this check since this can cause a slient crash
        if (!fs.existsSync(dirPath)) { return []; }

        const files = fs.readdirSync(dirPath);
        return files.map(file => {
            const fullPath = path.join(dirPath, file);
            const isDirectory = fs.lstatSync(fullPath).isDirectory();

            return new FileItem(
                file,
                isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                fullPath
            );
        });
    }
}
export class FileItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly fsPath: string
    ) {
        super(label, collapsibleState);
        this.tooltip = this.fsPath;
        this.contextValue = 'fileItem'; // Used for context menus
    }
}