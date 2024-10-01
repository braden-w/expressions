import { Extension, type Editor } from '@tiptap/core';

export const TabHandler = Extension.create({
	name: 'tabHandler',
	addKeyboardShortcuts() {
		const TAB_CHAR = '\u0009';

		const createEditorIndentFunctionality = (editor: Editor) => ({
			isCursorAtStartOfListItem:
				editor.isActive('listItem') &&
				editor.state.selection.$from.parentOffset === 0,
			indentListItem: () => editor.chain().sinkListItem('listItem').run(),
			unindentListItem: () => editor.chain().liftListItem('listItem').run(),
			insertTab: () =>
				editor
					.chain()
					.command(({ tr }) => {
						tr.insertText(TAB_CHAR);
						return true;
					})
					.run(),
			removeTabIfBehindCursor: () => {
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
			},
		});

		return {
			Tab: ({ editor }) => {
				const { isCursorAtStartOfListItem, insertTab, indentListItem } =
					createEditorIndentFunctionality(editor);

				if (isCursorAtStartOfListItem && indentListItem()) {
					return true;
				}

				insertTab();
				return true;
			},

			'Shift-Tab': ({ editor }) => {
				const {
					isCursorAtStartOfListItem,
					unindentListItem,
					removeTabIfBehindCursor,
				} = createEditorIndentFunctionality(editor);

				if (isCursorAtStartOfListItem && unindentListItem()) {
					return true;
				}

				removeTabIfBehindCursor();
				return true;
			},
		};
	},
});
