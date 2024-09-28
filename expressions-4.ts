import { Extension, type Editor } from '@tiptap/core';

export const TabHandler = Extension.create({
	name: 'tabHandler',
	addKeyboardShortcuts() {
		const TAB_CHAR = '\u0009';

		const useTabEditor = (editor: Editor) => ({
			isCursorAtStartOfListItem:
				editor.isActive('listItem') &&
				editor.state.selection.$from.parentOffset === 0,
			insertTab: () =>
				editor
					.chain()
					.command(({ tr }) => {
						tr.insertText(TAB_CHAR);
						return true;
					})
					.run(),
			removeTabIfBehind: () => {
				const {
					selection: { $from },
					doc,
				} = editor.state;

				const isPreviousCharTab =
					doc.textBetween($from.pos - 1, $from.pos) === TAB_CHAR;

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
			indentListItem: () => editor.chain().sinkListItem('listItem').run(),
			unindentListItem: () => editor.chain().liftListItem('listItem').run(),
		});

		return {
			Tab: ({ editor }) => {
				const { insertTab, isCursorAtStartOfListItem, indentListItem } =
					useTabEditor(editor);

				if (isCursorAtStartOfListItem) {
					const isIndentSuccess = indentListItem();
					if (isIndentSuccess) {
						return true;
					}
				}

				insertTab();
				return true;
			},

			'Shift-Tab': ({ editor }) => {
				const {
					removeTabIfBehind,
					isCursorAtStartOfListItem,
					unindentListItem,
				} = useTabEditor(editor);

				if (isCursorAtStartOfListItem) {
					const isUnindentSuccess = unindentListItem();
					if (isUnindentSuccess) {
						return true;
					}
				}

				removeTabIfBehind();
				return true;
			},
		};
	},
});
