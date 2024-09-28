import { type Editor, Extension } from '@tiptap/core';

export const TabHandler = Extension.create({
	name: 'tabHandler',
	addKeyboardShortcuts() {
		const TAB_CHAR = '\u0009';

		const isCursorAtStartOfListItem = (editor: Editor) =>
			editor.isActive('listItem') &&
			editor.state.selection.$from.parentOffset === 0;

		return {
			Tab: ({ editor }) => {
				if (isCursorAtStartOfListItem(editor)) {
					const indentListItem = () =>
						editor.chain().sinkListItem('listItem').run();
					const isIndentSuccess = indentListItem();
					if (isIndentSuccess) {
						return true;
					}
				}

				const insertTab = () =>
					editor
						.chain()
						.command(({ tr }) => {
							tr.insertText(TAB_CHAR);
							return true;
						})
						.run();
				insertTab();
				return true;
			},

			'Shift-Tab': ({ editor }) => {
				if (isCursorAtStartOfListItem(editor)) {
					const unindentListItem = () =>
						editor.chain().liftListItem('listItem').run();
					const isUnindentSuccess = unindentListItem();
					if (isUnindentSuccess) {
						return true;
					}
				}

				const removeTabIfBehind = () =>
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
				removeTabIfBehind();
				return true;
			},
		};
	},
});
