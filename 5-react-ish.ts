import { type Editor, Extension } from '@tiptap/core';

const TAB_CHAR = '\u0009';

const useTabEditor = (editor: Editor) => ({
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

const Tab = ({ editor }) => {
	const { isCursorAtStartOfListItem, insertTab, indentListItem } =
		useTabEditor(editor);

	if (isCursorAtStartOfListItem && indentListItem()) {
		return true;
	}

	insertTab();
	return true;
};

const ShiftTab = ({ editor }) => {
	const {
		isCursorAtStartOfListItem,
		unindentListItem,
		removeTabIfBehindCursor,
	} = useTabEditor(editor);

	if (isCursorAtStartOfListItem && unindentListItem()) {
		return true;
	}

	removeTabIfBehindCursor();
	return true;
};
