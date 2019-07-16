import * as vscode from 'vscode';

/**
 * Collection of DMessages that were generated during a single check run.
 */
export class DCollection {
    private filePaths: Set<string> = new Set(); // Set of checked files
    private messages: DMessage[] = [];          // Collection of diagnostic messages from the check run

    public addFilePath(filePath: string) {
        this.filePaths.add(filePath);
    }

    public addMessage(filePath: string, range: vscode.Range, text: string) {
        this.messages.push(new DMessage(filePath, range, text));
        this.filePaths.add(filePath);
    }

    public addAll(src: DCollection) {
        src.messages.forEach(m => this.messages.push(m));
        src.filePaths.forEach(p => this.filePaths.add(p));
    }

    /**
     * Applies all the messages from the given collection.
     * Also removes messages from the checked files if necessary.
     */
    public apply(dc: vscode.DiagnosticCollection) {
        // Clear diagnostic for all checked files
        this.filePaths.forEach(p => dc.delete(pathToUri(p)));
        // Add messages that were found
        const uri2diag = new Map<string, vscode.Diagnostic[]>();
        this.messages.forEach(d => {
            let list = uri2diag.get(d.filePath);
            if (!list) {
                list = [];
                uri2diag.set(d.filePath, list);
            }
            list.push(d.diagnostic);
        });
        uri2diag.forEach((diags, path) => dc.set(pathToUri(path), diags));
    }
}

/**
 * A Diagnostic instance linked to the corresponding file.
 */
class DMessage {
    readonly filePath: string;
    readonly diagnostic: vscode.Diagnostic;

    constructor(filePath: string, range: vscode.Range, text: string) {
        this.filePath = filePath;
        this.diagnostic = new vscode.Diagnostic(range, text, vscode.DiagnosticSeverity.Error);
    }
}

function pathToUri(path: string): vscode.Uri {
    return vscode.Uri.parse('file://' + path);
}