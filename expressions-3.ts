import { type Editor, Extension } from '@tiptap/core';

export const TabHandler = Extension.create({
	name: 'tabHandler',
	addKeyboardShortcuts() {
		const TAB_CHAR = '\u0009';

		const isCursorAtStartOfListItem = (editor: Editor) =>
			editor.isActive('listItem') &&
			editor.state.selection.$from.parentOffset === 0;

		const indentListItem = (editor: Editor) =>
			editor.chain().sinkListItem('listItem').run();

		const unindentListItem = (editor: Editor) =>
			editor.chain().liftListItem('listItem').run();

		const insertTab = (editor: Editor) =>
			editor
				.chain()
				.command(({ tr }) => {
					tr.insertText(TAB_CHAR);
					return true;
				})
				.run();

		const removeTabIfBehind = (editor: Editor) =>
			editor
				.chain()
				.command(({ tr }) => {
					tr.delete(
						editor.state.selection.$from.pos - 1,
						editor.state.selection.$from.pos,
					);
					return true;
				})
				.run();

		return {
			Tab: ({ editor }) => {
				if (isCursorAtStartOfListItem(editor)) {
					const isIndentSuccess = indentListItem(editor);
					if (isIndentSuccess) {
						return true;
					}
				}

				insertTab(editor);
				return true;
			},

			'Shift-Tab': ({ editor }) => {
				if (isCursorAtStartOfListItem(editor)) {
					const isUnindentSuccess = unindentListItem(editor);
					if (isUnindentSuccess) {
						return true;
					}
				}

				removeTabIfBehind(editor);
				return true;
			},
		};
	},
});
