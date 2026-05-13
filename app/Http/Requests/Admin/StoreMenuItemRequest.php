<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenuItemRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:page,url'],
            'page_id' => ['nullable', 'exists:pages,id', 'required_if:type,page'],
            'url' => ['nullable', 'string', 'required_if:type,url'],
            'target' => ['nullable', 'in:_self,_blank'],
            'parent_id' => ['nullable', 'exists:menu_items,id'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
