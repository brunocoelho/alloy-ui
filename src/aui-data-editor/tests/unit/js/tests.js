YUI.add('aui-data-editor-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-data-editor');

    suite.add(new Y.Test.Case({
        name: 'AUI Data Editor Unit Tests',

        _createTestEditorClass: function() {
            var setValueFn = function() {
                setValueFn.callCount++;
            };
            setValueFn.callCount = 0;

            var TestEditor = Y.Base.create('test-editor', Y.DataEditor, [], {
                _uiSetOriginalValue: setValueFn
            });

            return TestEditor;
        },

        'should set original value on init': function() {
            var editor,
                TestEditor = this._createTestEditorClass();

            editor = new TestEditor();
            Y.Assert.areEqual(1, editor._uiSetOriginalValue.callCount);
        },

        'should update ui when original value is set': function() {
            var editor,
                TestEditor = this._createTestEditorClass();

            editor = new TestEditor();
            editor.set('originalValue', 'other value');
            Y.Assert.areEqual(2, editor._uiSetOriginalValue.callCount);
        },

        'should throw error when instantiating abstract class': function() {
            Y.Assert.throwsError(Error, function() {
                new Y.DataEditor();
            });
        },

        'should remove node after editor is destroyed': function() {
            var editor,
                TestEditor = this._createTestEditorClass();

            editor = new TestEditor();

            editor.get('node').set('id', 'testEditor');
            Y.one('body').append(editor.get('node'));
            Y.Assert.isNotNull(Y.one('#testEditor'));

            editor.destroy();
            Y.Assert.isNull(Y.one('#testEditor'));
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'aui-data-editor' ] });
