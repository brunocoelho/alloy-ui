/**
 * The Form Builder Field Paragraph Component
 *
 * @module aui-form-builder
 * @submodule aui-form-builder-field-paragraph
 */

/**
 * A base class for Form Builder Field Paragraph.
 *
 * @class A.FormBuilderFieldParagraph
 * @extends A.FormField
 * @uses A.FormBuilderFieldBase
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.FormBuilderFieldParagraph = A.Base.create('form-builder-field-paragraph', A.FormFieldParagraph, [A.FormBuilderFieldBase], {
    /**
     * Fills the settings array with the information for this field.
     *
     * @method _fillSettings
     * @override
     * @protected
     */
    _fillSettings: function() {
        this._settings.push(
            {
                attrName: 'paragraph',
                editor: new A.ParagraphDataEditor({
                    label: 'Alloy Editor Paragraph'
                })
            }
        );
    }
});
