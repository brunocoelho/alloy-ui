/**
 * The Form Builder Component
 *
 * @module aui-form-builder
 * @submodule aui-form-builder-field-text
 */

var L = A.Lang,

    getCN = A.getClassName,

    CSS_FORM_CONTROL = getCN('form', 'control'),
    CSS_FIELD_INPUT = getCN('field', 'input'),
    CSS_FIELD_INPUT_TEXT = getCN('field', 'input', 'text'),
    CSS_FORM_BUILDER_FIELD = getCN('form-builder-field'),
    CSS_FORM_BUILDER_FIELD_NODE = getCN('form-builder-field', 'node'),

    TPL_INPUT = '<div class="row form-builder-field-wrapper"><input id="{id}" class="' + [CSS_FORM_BUILDER_FIELD_NODE,
        CSS_FIELD_INPUT, CSS_FIELD_INPUT_TEXT,
        CSS_FORM_CONTROL].join(' ') + '" name="{name}" type="text" value="{value}" /></div>',

    WIDTH_VALUES_MAP = {
        small: 'col col-xs-5 col-sm-3 col-md-3',
        medium: 'col col-xs-6 col-sm-5 col-md-5',
        large: 'col col-xs-12 col-sm-7 col-md-7'
    };

/**
 * A base class for `A.FormBuilderTextField`.
 *
 * @class A.FormBuilderTextField
 * @extends A.FormBuilderField
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
var FormBuilderTextField = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: 'form-builder-text-field',

    /**
     * Static property used to define the default attribute
     * configuration for the `A.FormBuilderTextField`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Reusable block of markup used to generate the field.
         *
         * @attribute template
         */
        template: {
            valueFn: function() {
                return TPL_INPUT;
            }
        },

        /**
         * The width of the input field.
         *
         * @attribute width
         * @default 'small'
         */
        width: {
            value: 'small'
        }

    },

    /**
     * Static property provides a string to identify the CSS prefix.
     *
     * @property CSS_PREFIX
     * @type String
     * @static
     */
    CSS_PREFIX: CSS_FORM_BUILDER_FIELD,

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.FormBuilderField,

    prototype: {

        /**
         * Injects data into the template and returns the HTML result.
         *
         * @method getHTML
         * @return {String}
         */
        getHTML: function() {
            var instance = this;

            return L.sub(
                instance.get('template'), {
                    id: instance.get('id'),
                    label: instance.get('label'),
                    name: instance.get('name'),
                    value: instance.get('predefinedValue'),
                    width: instance.get('width')
                }
            );
        },

        /**
         * Returns a list of property models including the `A.RadioCellEditor`
         * model.
         *
         * @method getPropertyModel
         */
        getPropertyModel: function() {
            var instance = this,
                strings = instance.getStrings();

            var model = A.FormBuilderTextField.superclass.getPropertyModel.apply(instance, arguments);

            model.push({
                attributeName: 'width',
                editor: new A.RadioCellEditor({
                    options: {
                        small: strings.small,
                        medium: strings.medium,
                        large: strings.large
                    }
                }),
                formatter: function(o) {
                    return strings[o.data.value];
                },
                name: strings.width
            });

            model.push({
                attributeName: 'validator',
                editor: new A.ValidatorCellEditor({
                    type: 'text', // TODO: Get the real type when intregrating with Liferay Portal
                    rules: instance._parseRules('contains("foo") && equals("bar") && isValidEmail() && doesNotContains("bar") && isValidURL()')
                }),
                formatter: function() {},
                name: strings['validator']
            });

            model.push({
                attributeName: 'conditionalVisibility',
                editor: new A.ConditionalVisibilityCellEditor({
                    // TODO: Create a parser with mixed rules
                    rules: [
                        { field: { type: 'text', name: 'text525' }, validationType: 'equals', value: ['foo'] },
                        { field: { type: 'text', name: 'textarea3550' }, validationType: 'isValidURL', value: [] },
                        { field: { type: 'number', name: 'radio743' }, validationType: 'lessThan', value: ['20'] },
                        { field: { type: 'number', name: 'button3052' }, validationType: 'equalTo', value: ['10'] }
                    ]
                }),
                name: strings.conditionalVisibility
            });

            return model;
        },

        /**
         * Helper method to parse rules.
         *
         * @method _parseRules
         * @param {String} rules
         * @return {Object}
         * @protected
         */
        _parseRules: function(rules) {
            var instance = this,
                numberRegex = />|<|=/,
                textRegex = /contains|doesNotContains|equals|isValidEmail|isValidURL/;

            if (rules.match(numberRegex)) {
                return instance._parseNumberRules(rules);
            }
            else if (rules.match(textRegex)) {
                return instance._parseTextRules(rules);
            }
        },

        /**
         * Helper method to parse number rules.
         *
         * @method _parseNumberRules
         * @param {String} rules
         * @return {Object}
         * @protected
         */
        _parseNumberRules: function(rules) {
            var arrayOfRules = rules.split('&&'),
                equivalentFunctions = {
                    '<': 'lessThan',
                    '<=': 'lessThanOrEqual',
                    '>': 'greaterThan',
                    '>=': 'greaterThanOrEqual',
                    '==': 'equalTo',
                    '!=': 'notEqualTo'
                },
                i,
                len = arrayOfRules.length,
                parsedRules = [],
                regex = /(\W+)(\w+(?:\.?\w+)?)/,
                rule;

                for (i = 0; i < len; i++) {
                    rule = arrayOfRules[i].trim();
                    rule = rule.match(regex);

                    parsedRules.push({ validationType: equivalentFunctions[rule[1].trim()], value: [rule[2]] });
                }

                return parsedRules;
        },

        /**
         * Helper method to parse text rules.
         *
         * @method _parseTextRules
         * @param {String} rules
         * @return {Object}
         * @protected
         */
        _parseTextRules: function(rules) {
            var arrayOfRules = rules.split('&&'),
                i,
                len = arrayOfRules.length,
                parsedRules = [],
                regex = /(\w+)\((.*)\)/,
                rule;

            for (i = 0; i < len; i++) {
                rule = arrayOfRules[i].trim();
                rule = rule.match(regex);

                value = rule[2].replace(/\'|\"/g, '').split(',').map(function(param) {
                    return param.trim();
                });

                parsedRules.push({ validationType: rule[1], value: value });
            }

            return parsedRules;
        },

        /**
         * Set the `width` attribute in the UI.
         *
         * @method _uiSetWidth
         * @param val
         * @protected
         */
        _uiSetWidth: function(val) {
            var instance = this,
                templateNode = instance.get('templateNode');

            templateNode.removeClass(WIDTH_VALUES_MAP[instance.prevWidth]);
            templateNode.addClass(WIDTH_VALUES_MAP[val]);

            instance.prevWidth = val;
        }

    }

});

A.FormBuilderTextField = FormBuilderTextField;

A.FormBuilder.types.text = A.FormBuilderTextField;
