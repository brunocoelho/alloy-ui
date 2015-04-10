/**
 * The Paragraph Data Editor Component
 *
 * @module aui-paragraph-data-editor
 */

var CSS_PARAGRAPH_DATA_EDITOR = A.getClassName('paragraph', 'data', 'editor');

/**
 * A base class for Paragraph Data Editor.
 *
 * @class A.ParagraphDataEditor
 * @extends A.DataEditor
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.ParagraphDataEditor = A.Base.create('paragraph-data-editor', A.DataEditor, [], {
    TPL_EDITOR_CONTENT: '<div class="' + CSS_PARAGRAPH_DATA_EDITOR + '">' +
        '<div id="alloy-editor-field-control" class="alloy-editor-placeholder" contenteditable="true" data-placeholder="Write here the headline"></div></div>',

    /**
     * Constructor for the `A.ParagraphDataEditor`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var paragraphNode = this.get('node').one('#alloy-editor-field-control');

        this.alloyEditor = new A.AlloyEditor({
            srcNode: paragraphNode,
            toolbars: {
                styles: ['strong', 'em', 'u', 'h1', 'a']
            },
            extraPlugins: 'uicore,selectionregion,linktooltip,uiloader',
            uiNode: A.one('.modal-dialog')
        });
    },

    /**
     * Returns the currently paragraph value.
     *
     * @method _getParagraphValue
     * @protected
     * @return {String} The html string representation of the paragraph
     */
    _getParagraphValue: function() {
        return this.alloyEditor.get('srcNode').get('innerHTML');
    }
}, {
    /**
     * Static property used to define the default attribute configuration
     * for the `A.TextDataEditor`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * The value after edition.
         *
         * @attribute editedValue
         * @default ''
         * @type String
         */
        editedValue: {
            getter: '_getParagraphValue',
            value: ''
        },

        /**
         * The value to be edited.
         *
         * @attribute originalValue
         * @default ''
         * @type String
         */
        originalValue: {
            value: ''
        }
    }
});
