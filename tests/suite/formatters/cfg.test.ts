import * as vscode from 'vscode';
import { assertOnTypeFormatting, OPT_2_SPACES } from './formatting';
import { CfgOnTypeFormattingEditProvider } from '../../../src/formatters/cfg';

suite('Config On Type Formatting Test Suite', () => {
    let doc: vscode.TextDocument;

    suiteSetup(async () => {
        doc = await vscode.workspace.openTextDocument({ language: 'tlaplus.cfg' });
    });

    suiteTeardown(async () => {
        await vscode.window.showTextDocument(doc, {preview: true, preserveFocus: false});
        return vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    test('Indents constants-block body', () => {
        return assertCfgOnTypeFormatting(doc, [
                'CONSTANTS',
                '{enter}'
            ], [
                'CONSTANTS',
                '  '
            ]
        );
    });

    test('Indents invariants-block body', () => {
        return assertCfgOnTypeFormatting(doc, [
                'INVARIANTS',
                '{enter}EverythingIsCorrect'
            ], [
                'INVARIANTS',
                '  EverythingIsCorrect'
            ]
        );
    });

    test('Indents properties-block body', () => {
        return assertCfgOnTypeFormatting(doc, [
                'PROPERTIES',
                '{enter}(**)'
            ], [
                'PROPERTIES',
                '  (**)'
            ]
        );
    });

    test('Indents constraints-block body', () => {
        return assertCfgOnTypeFormatting(doc, [
                'CONSTRAINTS',
                '{enter}'
            ], [
                'CONSTRAINTS',
                '  '
            ]
        );
    });
});

function assertCfgOnTypeFormatting(
    doc: vscode.TextDocument,
    docLines: string[],
    expectLines: string[],
    options: vscode.FormattingOptions = OPT_2_SPACES
): Promise<void> {
    return assertOnTypeFormatting(
        new CfgOnTypeFormattingEditProvider(),
        doc,
        docLines,
        expectLines,
        options
    );
}