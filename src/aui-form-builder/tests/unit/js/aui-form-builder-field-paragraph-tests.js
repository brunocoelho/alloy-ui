YUI.add('aui-form-builder-field-paragraph-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-form-builder-field-paragraph');

    suite.add(new Y.Test.Case({
        name: 'Form Builder Field Paragraph Tests',

        tearDown: function() {
            if (this._field) {
                this._field.destroy();
                Y.one('#settings').empty();
            }
        },

        'should be able to edit settings': function() {
            var settings = Y.one('#settings');

            this._field = new Y.FormBuilderFieldParagraph();
            Y.one('#container').append(this._field.get('content'));

            this._field.renderSettingsPanel(settings);

            this._field.saveSettings();

            Y.Assert.areEqual(this._field.get('paragraph'), '');
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: ['aui-form-builder-field-paragraph', 'node-event-simulate', 'test'],
    test: function(Y) {
        return Y.UA.ie === 0 || Y.UA.ie > 8;
    }
});
