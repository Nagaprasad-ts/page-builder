import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

type Props = {
    value: string;
    onChange: (html: string) => void;
    className?: string;
};

export function RichtextEditor({ value, onChange, className }: Props) {
    const editor = useEditor({
        extensions: [StarterKit, Link.configure({ openOnClick: false })],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const setLink = () => {
        if (!editor) {
            return;
        }
        const url = window.prompt('URL', editor.getAttributes('link').href ?? '');
        if (url === null) {
            return;
        }
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className={cn('rounded-md border border-input', className)}>
            <div className="flex items-center gap-1 border-b border-input px-2 py-1">
                <Toggle
                    size="sm"
                    pressed={editor?.isActive('bold') ?? false}
                    onPressedChange={() => editor?.chain().focus().toggleBold().run()}
                    aria-label="Bold"
                >
                    <Bold className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor?.isActive('italic') ?? false}
                    onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
                    aria-label="Italic"
                >
                    <Italic className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor?.isActive('link') ?? false}
                    onPressedChange={setLink}
                    aria-label="Link"
                >
                    <LinkIcon className="h-3.5 w-3.5" />
                </Toggle>
            </div>
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none px-3 py-2 focus-within:outline-none [&_.ProseMirror]:min-h-[80px] [&_.ProseMirror]:outline-none"
            />
        </div>
    );
}
