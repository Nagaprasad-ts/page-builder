import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function CreateMenu() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        location: 'desktop_nav' as 'desktop_nav' | 'mobile_nav' | 'footer',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/menus');
    };

    return (
        <>
            <Head title="New menu" />

            <div className="mx-auto max-w-lg space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">New menu</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create a navigation menu and assign it to a location.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Main Navigation"
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="location">Location</Label>
                        <Select
                            value={data.location}
                            onValueChange={(v) =>
                                setData('location', v as typeof data.location)
                            }
                        >
                            <SelectTrigger id="location">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desktop_nav">
                                    Desktop navigation
                                </SelectItem>
                                <SelectItem value="mobile_nav">
                                    Mobile navigation
                                </SelectItem>
                                <SelectItem value="footer">Footer</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.location && (
                            <p className="text-xs text-destructive">
                                {errors.location}
                            </p>
                        )}
                    </div>

                    <Button type="submit" disabled={processing}>
                        Create menu
                    </Button>
                </form>
            </div>
        </>
    );
}
