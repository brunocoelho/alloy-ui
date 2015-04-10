YUI.add('aui-form-field-paragraph-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-form-field-paragraph');

    suite.add(new Y.Test.Case({
        name: 'Form Field Paragraph Tests',

        tearDown: function() {
            if (this._field) {
                this._field.destroy();
            }
        },

        'should render a node to show paragraph\' text': function() {
            var fieldNode;

            this._field = new Y.FormFieldParagraph();
            fieldNode = this._field.get('content');

            Y.Assert.isNotNull(fieldNode.one('.form-builder-field-paragraph-content'));
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {requires: ['aui-form-field-paragraph', 'test']});
