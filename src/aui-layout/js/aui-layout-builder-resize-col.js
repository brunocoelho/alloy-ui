/**
 * The Layout Builder Resize Col Component
 *
 * @module aui-layout-builder-resize-col
 */

var CSS_LAYOUT_DRAG_HANDLE = A.getClassName('layout', 'drag', 'handle'),
    CSS_LAYOUT_GRID = A.getClassName('layout', 'grid'),
    CSS_LAYOUT_RESIZING = A.getClassName('layout', 'resizing'),
    MAX_NUMBER_OF_COLUMNS = 4,
    MAX_SIZE = 12,
    OFFSET_WIDTH = 'offsetWidth',
    SELECTOR_COL = '.col',
    SELECTOR_ROW = '.row';

/**
 * LayoutBuilder extension, which can be used to add the funcionality of resizing
 * columns of the builder's layout.
 *
 * @class A.LayoutBuilderResizeCol
 * @param {Object} config Object literal specifying layout builder configuration
 *     properties.
 * @constructor
 */

A.LayoutBuilderResizeCol = function() {};

A.LayoutBuilderResizeCol.prototype = {
    /**
     * Holds the drag handle node.
     *
     * @property dragHandle
     * @type {Node}
     * @protected
     */
    dragHandle: null,

    /**
     * Determines if dragHandle is locked.
     *
     * @property isDragHandleLocked
     * @type {Boolean}
     * @protected
     */
    isDragHandleLocked: false,

    /**
     * Construction logic executed during `A.LayoutBuilderResizeCol` instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        this._createDragHandle();

        this._eventHandles.push(
            this.after('enableResizeColsChange', this._afterEnableResizeColsChange)
        );

        this._uiSetEnableResizeCols(this.get('enableResizeCols'));
    },

    /**
     * Destructor implementation for the `A.LayoutBuilderResizeCol` class.
     * Lifecycle.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {
        this._unbindResizeColEvents();
    },

    /**
     * Fired after the `enableResizeCols` attribute changes.
     *
     * @method _afterEnableResizeColsChange
     * @protected
     */
    _afterEnableResizeColsChange: function() {
        this._uiSetEnableResizeCols(this.get('enableResizeCols'));
    },

    /**
     * Calculates if current target has space to move into parent's row.
     *
     * @method _availableSpaceToMove
     * @param {Node} col Node to check if next col has available space to decrease.
     * @return {Number}
     * @protected
     */
    _availableSpaceToMove: function(col) {
        var nextCol = col.next().getData('layout-col');

        return nextCol.get('size') - nextCol.get('minSize');
    },

    /**
     * Binds the necessary events for the functionality of resizing layout
     * columns.
     *
     * @method _bindResizeColEvents
     * @protected
     */
    _bindResizeColEvents: function() {
        var container = this.get('container');

        this._resizeColsEventHandles = [
            container.delegate('mousedown', A.bind(this._onMouseDownEvent, this), '.' + CSS_LAYOUT_DRAG_HANDLE),
            container.delegate('mouseenter', A.bind(this._onMouseEnterEvent, this), SELECTOR_COL),
            container.delegate('mouseleave', A.bind(this._onMouseLeaveEvent, this), SELECTOR_COL)
        ];
    },

    /**
     * Creates drag handle node.
     *
     * @method _createDragHandle
     * @protected
     */
    _createDragHandle: function() {
        this.dragHandle = A.Node.create('<span>').addClass(CSS_LAYOUT_DRAG_HANDLE);
    },

    /**
     * Decreases col width.
     *
     * @method _decreaseCol
     * @param {Node} target Node that will be decreased.
     * @param {Number} dragDifference Difference in pixels between mousedown and
     *   mouseup event's clientX.
     * @protected
     */
    _decreaseCol: function(target, dragDifference) {
        var colWidth = this.get('container').get(OFFSET_WIDTH) / MAX_SIZE,
            col = target.getData('layout-col'),
            currentSize = col.get('size'),
            minSize = col.get('minSize'),
            nextSize,
            targetWidth = target.get(OFFSET_WIDTH);

        nextSize = Math.ceil((targetWidth - dragDifference) / colWidth);

        if (nextSize < minSize) {
            nextSize = minSize;
        }

        if (!this._isBreakpoint(target, nextSize)) {
            return;
        }

        if (nextSize < currentSize) {
            col.set('size', nextSize);
            this._increaseNextCol(target, currentSize - nextSize);
        }
    },

    /**
     * Decreases col width.
     *
     * @method _decreaseNextCol
     * @param {Node} col Node that will be decreased.
     * @param {Number} size Exact size to decrease.
     * @protected
     */
    _decreaseNextCol: function(col, size) {
        var nextCol = col.next().getData('layout-col');
        nextCol.set('size', nextCol.get('size') - size);
    },

    /**
     * Gets the size of the given column node.
     *
     * @method _getColSize
     * @param {Node} col Node to get the size of.
     * @return {Number} Size of the column.
     * @protected
     */
    _getColSize: function(col) {
        return col.getData('layout-col').get('size');
    },

    /**
     * Calculates if current target has space to move into parent's row.
     *
     * @method _hasSpaceToMove
     * @param {Node} col Node of the column to check for space.
     * @return {Boolean}
     * @protected
     */
    _hasSpaceToMove: function(col) {
        var nextCol = col.next().getData('layout-col'),
            nextColSize = nextCol.get('size');

        return nextColSize > nextCol.get('minSize');
    },

    /**
     * Increases col width.
     *
     * @method _increaseCol
     * @param {Node} col Node that will be increased.
     * @param {Number} dragDifference Difference in pixels between mousedown and
     *   mouseup event's clientX.
     * @protected
     */
    _increaseCol: function(col, dragDifference) {
        var availableSpaceToMove = this._availableSpaceToMove(col),
            colWidth = this.get('container').get(OFFSET_WIDTH) / MAX_SIZE,
            currentSize = this._getColSize(col),
            difference,
            nextSize;

        nextSize = Math.ceil((col.get(OFFSET_WIDTH) - dragDifference) / colWidth);

        difference = nextSize - currentSize;

        if (difference > availableSpaceToMove) {
            nextSize = currentSize + availableSpaceToMove;
            difference = availableSpaceToMove;
        }

        if (!this._isBreakpoint(col, nextSize)) {
            return;
        }

        col.getData('layout-col').set('size', nextSize);
        this._decreaseNextCol(col, difference);
    },

    /**
     * Increases col width.
     *
     * @method _increaseNextCol
     * @param {Node} col Node that will be increased.
     * @param {Number} size Exact size to increase.
     * @protected
     */
    _increaseNextCol: function(col, size) {
        var nextCol = col.next().getData('layout-col');
        nextCol.set('size', nextCol.get('size') + size);
    },

    /**
     * Inserts a grid to the current row in order to visualize the possible breakpoints.
     *
     * @method _insertGrid
     * @param {Node} target Node in which the grid will be inserted.
     * @protected
     */
    _insertGrid: function(row) {
        var breakpoints = this.get('breakpoints'),
            gridLine,
            gridWidth = row.get(OFFSET_WIDTH) / MAX_SIZE;

        A.each(breakpoints, function(point) {
            gridLine = A.Node.create('<div>').addClass(CSS_LAYOUT_GRID);
            gridLine.setStyle('left', gridWidth * point);
            row.append(gridLine);
        });
    },

    /**
     * Calculates if this col is inside a breakpoint.
     *
     * @method _isBreakpoint
     * @param {Node} col Node in which the breakpoint will be calculated.
     * @param {Node} size Size of the current col.
     * @return {Boolean}
     * @protected
     */
    _isBreakpoint: function(col, size) {
        var breakpoints = this.get('breakpoints'),
            totalSize = 0;

        while (col.previous()) {
            col = col.previous();

            totalSize += col.getData('layout-col').get('size');
        }

        totalSize += size;

        return A.Array.indexOf(breakpoints, totalSize) >= 0;
    },

    /**
     * Calculates the space on the left side of a col.
     *
     * @method _leftAvailableSpace
     * @param {Node} col
     * @return {Number}
     * @protected
     */
    _leftAvailableSpace: function(col) {
        var width = col.get(OFFSET_WIDTH);

        while (col.previous()) {
            col = col.previous();
            width += col.get(OFFSET_WIDTH);
        }

        return width;
    },

    /**
     * Fired on `mousedown`. Inserts the drag grid and listens to the next
     * `mouseup` event.
     *
     * @method _onMouseDownEvent
     * @param {EventFacade} event
     * @protected
     */
    _onMouseDownEvent: function(event) {
        var body = A.one('body'),
            clientX = event.clientX,
            col = event.target.ancestor(),
            leftAvailableSpace = this._leftAvailableSpace(col),
            rightAvailableSpace = this._rightAvailableSpace(col);

        this.isDragHandleLocked = true;

        this._insertGrid(col.ancestor(SELECTOR_ROW));

        body.addClass(CSS_LAYOUT_RESIZING);

        body.once('mouseup', this._onMouseUpEvent, this, clientX, col);

        this._mouseMoveEvent = body.on('mousemove', this._onMouseMove, this, clientX, leftAvailableSpace, rightAvailableSpace);
    },

    /**
     * Adds a handle node to target.
     *
     * @method _onMouseEnterEvent
     * @param {EventFacade} event
     * @protected
     */
    _onMouseEnterEvent: function(event) {
        var col = event.target,
            numberOfCols,
            row = col.ancestor(SELECTOR_ROW).getData('layout-row');

        numberOfCols = row.get('cols').length;

        if (numberOfCols < MAX_NUMBER_OF_COLUMNS) {
            if (!this.isDragHandleLocked && col.next()) {
                col.append(this.dragHandle);
            }
        }
    },

    /**
     * Removes handle node.
     *
     * @method _onMouseLeaveEvent
     * @protected
     */
    _onMouseLeaveEvent: function() {
        if (!this.isDragHandleLocked) {
            this.dragHandle.remove();
        }
    },

    /**
     * Moves drag handle.
     *
     * @method _onMouseMove
     * @param {EventFacade} event
     * @param {Number} clientX
     * @param {Number} leftAvailableSpace
     * @param {Number} rightAvailableSpace
     * @protected
     */
    _onMouseMove: function(event, clientX, leftAvailableSpace, rightAvailableSpace) {
        var absDifference,
            difference = clientX - event.clientX,
            dragHandleWidth = this.dragHandle.get('offsetWidth'),
            rightPosition;

        absDifference = Math.abs(difference);

        if (difference < 0) {
            if (absDifference <= rightAvailableSpace) {
                rightPosition = difference + 'px';
            }
            else {
                rightPosition = -rightAvailableSpace + 'px';
            }
        }
        else {
            if (difference <= leftAvailableSpace) {
                rightPosition = (difference - dragHandleWidth) + 'px';
            }
            else {
                rightPosition = (leftAvailableSpace - dragHandleWidth) + 'px';
            }
        }

        this.dragHandle.setStyle('right', rightPosition);
    },

    /**
     * Fires on `mouseup`. Makes the necessary changes to the layout.
     *
     * @method _onMouseUpEvent
     * @param {EventFacade} event
     * @param {Number} mouseDownClientX ClientX of previous mousedown event
     * @param {Node} col Node of the column to be resized
     * @protected
     */
    _onMouseUpEvent: function(event, mouseDownClientX, col) {
        var dragDifference = mouseDownClientX - event.clientX;

        this.dragHandle.setStyle('right', 0);

        this.isDragHandleLocked = false;

        this._mouseMoveEvent.detach();

        this._removeGrid(event.target);

        if (dragDifference > 0) {
            this._decreaseCol(col, dragDifference);
        }
        else if (dragDifference < 0 && this._hasSpaceToMove(col)) {
            this._increaseCol(col, dragDifference);
        }

        A.one('body').removeClass(CSS_LAYOUT_RESIZING);
    },

    /**
     * Removes the grid from the target.
     *
     * @method _removeGrid
     * @param {Node} target Node to remove the grid.
     * @protected
     */
    _removeGrid: function(target) {
        target.ancestor().all('.' + CSS_LAYOUT_GRID).remove();
    },

    /**
     * Calculates the space on the right side of a col.
     *
     * @method _rightAvailableSpace
     * @param {Node} col
     * @return {Number}
     * @protected
     */
    _rightAvailableSpace: function(col) {
        var width = 0;

        while (col.next()) {
            col = col.next();
            width += col.get(OFFSET_WIDTH);
        }

        return width;
    },

    /**
     * Updates the UI according to the value of the `enableResizeCols` attribute.
     *
     * @method _uiSetEnableResizeCols
     * @param {Boolean} enableResizeCols
     * @protected
     */
    _uiSetEnableResizeCols: function(enableResizeCols) {
        if (enableResizeCols) {
            this._bindResizeColEvents();
        }
        else {
            this._unbindResizeColEvents();
            this.dragHandle.remove();
        }
    },

    /**
     * Unbinds the events related to the functionality of resizing layout
     * columns.
     *
     * @method _unbindResizeColEvents
     * @protected
     */
    _unbindResizeColEvents: function() {
        if (this._resizeColsEventHandles) {
            (new A.EventHandle(this._resizeColsEventHandles)).detach();
        }
    }
};

/**
 * Static property used to define the default attribute
 * configuration for `A.LayoutBuilderResizeCol`.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
A.LayoutBuilderResizeCol.ATTRS = {
    /**
     * Array of breakpoints.
     *
     * @attribute breakpoints
     * @type {Array}
     */
    breakpoints: {
        validator: A.Lang.isArray,
        value: [3, 4, 6, 8, 9]
    },

    /**
     * Flag indicating if the feature of resizing layout columns is enabled or
     * not.
     *
     * @attribute enableResizeCols
     * @default true
     * @type {Boolean}
     */
    enableResizeCols: {
        validator: A.Lang.isBoolean,
        value: true
    }
};
