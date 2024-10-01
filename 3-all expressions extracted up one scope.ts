import { Extension, type Editor } from '@tiptap/core';

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
		const removeTabIfBehindCursor = (editor: Editor) => {
			const { $from } = editor.state.selection;
			const isPreviousCharTab =
				editor.state.doc.textBetween($from.pos - 1, $from.pos) === TAB_CHAR;

			if (isPreviousCharTab) {
				editor
					.chain()
					.command(({ tr }) => {
						tr.delete($from.pos - 1, $from.pos);
						return true;
					})
					.run();
			}
		};

		return {
			Tab: ({ editor }) => {
				if (isCursorAtStartOfListItem(editor) && indentListItem(editor)) {
					return true;
				}

				insertTab(editor);
				return true;
			},

			'Shift-Tab': ({ editor }) => {
				if (isCursorAtStartOfListItem(editor) && unindentListItem(editor)) {
					return true;
				}

				removeTabIfBehindCursor(editor);
				return true;
			},
		};
	},
});
