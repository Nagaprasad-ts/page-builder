import { Image, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { FieldDef } from '@/types/builder';
import { RichtextEditor } from './richtext-editor';

type Props = {
    fieldKey: string;
    def: FieldDef;
    value: unknown;
    onChange: (value: unknown) => void;
    onOpenMediaPicker?: () => void;
};

export function FieldEditor({
    fieldKey,
    def,
    value,
    onChange,
    onOpenMediaPicker,
}: Props) {
    const id = `field-${fieldKey}`;

    if (def.type === 'array') {
        const items = (Array.isArray(value) ? value : []) as Record<
            string,
            unknown
        >[];
        const itemSchema = def.itemSchema ?? {};

        return (
            <div className="space-y-3">
                <Label>{def.label}</Label>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="space-y-2 rounded-lg border border-input bg-muted/30 p-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                                Item {index + 1}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => {
                                    const next = [...items];
                                    next.splice(index, 1);
                                    onChange(next);
                                }}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        {Object.entries(itemSchema).map(([subKey, subDef]) => (
                            <FieldEditor
                                key={subKey}
                                fieldKey={`${fieldKey}-${index}-${subKey}`}
                                def={subDef}
                                value={item[subKey] ?? subDef.default ?? null}
                                onChange={(v) => {
                                    const next = [...items];
                                    next[index] = {
                                        ...next[index],
                                        [subKey]: v,
                                    };
                                    onChange(next);
                                }}
                                onOpenMediaPicker={onOpenMediaPicker}
                            />
                        ))}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                        const defaults = Object.entries(itemSchema).reduce<
                            Record<string, unknown>
                        >((acc, [k, d]) => {
                            acc[k] = d.default ?? null;

                            return acc;
                        }, {});
                        onChange([...items, defaults]);
                    }}
                >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add item
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            {def.type !== 'boolean' && <Label htmlFor={id}>{def.label}</Label>}

            {def.type === 'text' ||
            def.type === 'url' ||
            def.type === 'number' ? (
                <Input
                    id={id}
                    type={def.type === 'number' ? 'number' : 'text'}
                    value={(value as string) ?? ''}
                    placeholder={def.type === 'url' ? 'https://' : ''}
                    onChange={(e) =>
                        onChange(
                            def.type === 'number'
                                ? Number(e.target.value)
                                : e.target.value,
                        )
                    }
                />
            ) : def.type === 'textarea' ? (
                <Textarea
                    id={id}
                    value={(value as string) ?? ''}
                    rows={3}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : def.type === 'richtext' ? (
                <RichtextEditor
                    value={(value as string) ?? ''}
                    onChange={onChange}
                />
            ) : def.type === 'image' ? (
                <div className="space-y-2">
                    {!!value && (
                        <div className="relative w-full overflow-hidden rounded-md border border-input">
                            <img
                                src={value as string}
                                alt="Selected"
                                className="max-h-32 w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => onChange(null)}
                                className="absolute top-1 right-1 rounded bg-black/60 p-1 text-white hover:bg-black/80"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={onOpenMediaPicker}
                    >
                        <Image className="mr-1.5 h-3.5 w-3.5" />
                        {value ? 'Change image' : 'Choose image'}
                    </Button>
                </div>
            ) : def.type === 'boolean' ? (
                <div className="flex items-center gap-2">
                    <Checkbox
                        id={id}
                        checked={(value as boolean) ?? false}
                        onCheckedChange={(checked) => onChange(!!checked)}
                    />
                    <Label htmlFor={id}>{def.label}</Label>
                </div>
            ) : def.type === 'select' ? (
                <Select
                    value={(value as string) ?? ''}
                    onValueChange={onChange}
                >
                    <SelectTrigger id={id}>
                        <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent>
                        {(def.options ?? []).map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : null}
        </div>
    );
}
