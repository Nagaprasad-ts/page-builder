import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Italic,
    Link as LinkIcon,
    Unlink,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Code,
    Eraser,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

        const url = window.prompt(
            'URL',
            editor.getAttributes('link').href ?? '',
        );

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();

            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    };

    if (!editor) {
        return null;
    }

    return (
        <div className={cn('rounded-md border border-input overflow-hidden bg-background relative', className)}>
            <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/40 p-1.5">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    className="h-7 w-7 p-0 data-[state=checked]:bg-background data-[state=checked]:shadow-sm"
                    aria-label="Bold"
                >
                    <Bold className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    className="h-7 w-7 p-0 data-[state=checked]:bg-background data-[state=checked]:shadow-sm"
                    aria-label="Italic"
                >
                    <Italic className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    className="h-7 w-7 p-0 data-[state=checked]:bg-background data-[state=checked]:shadow-sm"
                    aria-label="Strike"
                >
                    <Strikethrough className="h-3.5 w-3.5" />
                </Toggle>
                <div className="h-4 w-px bg-border mx-1" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    className="h-7 w-7 p-0 data-[state=checked]:bg-background data-[state=checked]:shadow-sm"
                    aria-label="Bullet List"
                >
                    <List className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    className="h-7 w-7 p-0 data-[state=checked]:bg-background data-[state=checked]:shadow-sm"
                    aria-label="Ordered List"
                >
                    <ListOrdered className="h-3.5 w-3.5" />
                </Toggle>
                <div className="h-4 w-px bg-border mx-1" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    className="h-7 w-7 p-0 data-[state=checked]:bg-background data-[state=checked]:shadow-sm"
                    aria-label="Blockquote"
                >
                    <Quote className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('code')}
                    onPressedChange={() => editor.chain().focus().toggleCode().run()}
                    className="h-7 w-7 p-0 data-[state=checked]:bg-background data-[state=checked]:shadow-sm"
                    aria-label="Code"
                >
                    <Code className="h-3.5 w-3.5" />
                </Toggle>
                <div className="h-4 w-px bg-border mx-1" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive('link')}
                    onPressedChange={setLink}
                    className="h-7 w-7 p-0 data-[state=checked]:bg-background data-[state=checked]:shadow-sm"
                    aria-label="Link"
                >
                    <LinkIcon className="h-3.5 w-3.5" />
                </Toggle>
                {editor.isActive('link') && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        title="Remove Link"
                    >
                        <Unlink className="h-3.5 w-3.5" />
                    </Button>
                )}
                <div className="h-4 w-px bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    title="Clear Formatting"
                >
                    <Eraser className="h-3.5 w-3.5" />
                </Button>
            </div>

            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none px-3 py-2.5 focus-within:outline-none [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:outline-none text-sm leading-relaxed"
            />
        </div>
    );
}
