<?php

namespace App\Http\Requests\Admin;

use App\Models\Page;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePageRequest extends FormRequest
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
        return [
            'title' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:pages,id'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^(\/|[a-z0-9][a-z0-9\-]*)$/',
                function ($attribute, $value, $fail) {
                    $parentId = $this->input('parent_id');
                    $parent = $parentId ? Page::find($parentId) : null;
                    $path = $parent ? $parent->path.'/'.$value : $value;
                    if (Page::where('path', $path)->exists()) {
                        $fail('The slug has already been taken.');
                    }
                },
            ],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'custom_header' => ['boolean'],
            'custom_footer' => ['boolean'],
            'no_index' => ['boolean'],
            'sections' => ['nullable', 'array'],
            'sections.*.region' => ['nullable', 'string', 'in:header,body,footer'],
            'sections.*.section_type' => ['required', 'string'],
            'sections.*.sort_order' => ['required', 'integer', 'min:0'],
            'sections.*.props' => ['nullable', 'array'],
        ];
    }
}
