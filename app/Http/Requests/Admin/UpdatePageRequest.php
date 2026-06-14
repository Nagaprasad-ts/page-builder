<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $page = $this->route('page');
        $pageId = $page instanceof \App\Models\Page ? $page->id : $page;

        return [
            'title' => ['required', 'string', 'max:255'],
            'parent_id' => [
                'nullable',
                'integer',
                'exists:pages,id',
                function ($attribute, $value, $fail) use ($pageId) {
                    if ($pageId && (int)$value === (int)$pageId) {
                        $fail('A page cannot be its own parent.');
                    }
                    if ($pageId && $value) {
                        $parentPage = \App\Models\Page::find($value);
                        $currentPage = \App\Models\Page::find($pageId);
                        if ($parentPage && $currentPage && $parentPage->isDescendantOf($currentPage)) {
                            $fail('Circular relationship detected (cannot select a child page as parent).');
                        }
                    }
                }
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^(\/|[a-z0-9][a-z0-9\-]*)$/',
                function ($attribute, $value, $fail) use ($pageId) {
                    $parentId = $this->input('parent_id');
                    $parent = $parentId ? \App\Models\Page::find($parentId) : null;
                    $path = $parent ? $parent->path . '/' . $value : $value;
                    if (\App\Models\Page::where('path', $path)->where('id', '!=', $pageId)->exists()) {
                        $fail('The slug has already been taken.');
                    }
                }
            ],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'custom_header' => ['boolean'],
            'custom_footer' => ['boolean'],
            'sections' => ['nullable', 'array'],
            'sections.*.region' => ['nullable', 'string', 'in:header,body,footer'],
            'sections.*.section_type' => ['required', 'string'],
            'sections.*.sort_order' => ['required', 'integer', 'min:0'],
            'sections.*.props' => ['nullable', 'array'],
        ];
    }
}
