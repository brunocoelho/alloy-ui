/**
 * The Form Field Paragraph Component
 *
 * @module aui-form-field-paragraph
 */

var CSS_FIELD_PARAGRAPH_CONTENT = A.getClassName('form', 'builder', 'field', 'paragraph', 'content');

/**
 * A base class for `A.FormFieldParagraph`.
 *
 * @class A.FormFieldParagraph
 * @extends A.FormField
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.FormFieldParagraph = A.Base.create('form-field-text', A.FormField, [A.FormFieldRequired], {
    TPL_FIELD_CONTENT: '<div class="' + CSS_FIELD_PARAGRAPH_CONTENT + '"></div>',

    /**
     * Constructor for the `A.FormFieldParagraph`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        this._uiSetParagraph(this.get('paragraph'));

        this.after({
            paragraphChange: this._afterParagraphChange
        });
    },

    /**
     * Create the DOM structure for the `A.FormFieldParagraph`. Lifecycle.
     *
     * @method renderUI
     * @protected
     */
    renderUI: function() {
        A.FormFieldParagraph.superclass.renderUI.call(this);
    },

    /**
     * Fired after the `paragraph` attribute is set.
     *
     * @method _afterParagraphChange
     * @protected
     */
    _afterParagraphChange: function() {
        this._uiSetParagraph(this.get('paragraph'));
    },

    /**
     * Updates the ui according to the value of the `paragraph` attribute.
     *
     * @method _uiSetParagraph
     * @param {String} paragraph
     * @protected
     */
    _uiSetParagraph: function(paragraph) {
        var inputNode = this.get('content').one('.' + CSS_FIELD_PARAGRAPH_CONTENT);

        inputNode.set('innerHTML', paragraph);
    }
}, {
    /**
     * Static property used to define the default attribute configuration
     * for the `A.FormFieldParagraph`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * Paragraph's text.
         *
         * @attribute paragraph
         * @default ''
         * @type String
         */
        paragraph: {
            validator: A.Lang.isString,
            value: ''
        }
    }
});
