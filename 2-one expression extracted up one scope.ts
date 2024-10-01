import { Extension, type Editor } from '@tiptap/core';

export const TabHandler = Extension.create({
	name: 'tabHandler',
	addKeyboardShortcuts() {
		const TAB_CHAR = '\u0009';

		const isCursorAtStartOfListItem = (editor: Editor) =>
			editor.isActive('listItem') &&
			editor.state.selection.$from.parentOffset === 0;

		return {
			Tab: ({ editor }) => {
				const indentListItem = (editor: Editor) =>
					editor.chain().sinkListItem('listItem').run();

				if (isCursorAtStartOfListItem(editor) && indentListItem(editor)) {
					return true;
				}

				const insertTab = (editor: Editor) =>
					editor
						.chain()
						.command(({ tr }) => {
							tr.insertText(TAB_CHAR);
							return true;
						})
						.run();
				insertTab(editor);
				return true;
			},

			'Shift-Tab': ({ editor }) => {
				const unindentListItem = (editor: Editor) =>
					editor.chain().liftListItem('listItem').run();

				if (isCursorAtStartOfListItem(editor) && unindentListItem(editor)) {
					return true;
				}

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
				removeTabIfBehindCursor(editor);
				return true;
			},
		};
	},
});
