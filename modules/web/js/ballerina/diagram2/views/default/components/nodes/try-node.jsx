/**
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import CompoundStatementDecorator from './compound-statement-decorator';
import { getComponentForNodeArray } from './../../../../diagram-util';
import TryNodeModel from './../../../../../model/tree/try-node';
import DropZone from './../../../../../drag-drop/DropZone';
import DefaultNodeFactory from './../../../../../model/default-node-factory';
import TreeBuilder from './../../../../../model/tree-builder';
import FragmentUtils from './../../../../../utils/fragment-utils';
import './try-node.css';

class TryNode extends React.Component {

    constructor(props) {
        super(props);
        this.editorOptions = {
            propertyType: 'text',
            key: 'Try condition',
            model: props.model,
            getterMethod: props.model.getConditionString,
            setterMethod: props.model.setConditionFromString,
        };
        this.onAddCatchClick = this.onAddCatchClick.bind(this);
        this.setCatchCondition = this.setCatchCondition.bind(this);
    }

    /**
     * Add new catch block to the try catch statement.
     * */
    onAddCatchClick() {
        const model = this.props.model;
        const catchBlocks = model.getCatchBlocks();
        if (catchBlocks) {
            const catchBlock = DefaultNodeFactory.createTry().getCatchBlocks()[0];
            model.addCatchBlocks(catchBlock);
        }
    }

    setCatchCondition(newCondition, catchBlock) {
        const fragmentJson = FragmentUtils.createArgumentParameterFragment(newCondition);
        const parsedJson = FragmentUtils.parseFragment(fragmentJson);
        const newNode = TreeBuilder.build(parsedJson, catchBlock, 'Catch');
        catchBlock.setParameter(newNode);
    }

    render() {
        const model = this.props.model;
        const bBox = model.viewState.bBox;
        const expression = model.viewState.components.expression;
        const catchViews = getComponentForNodeArray(model.catchBlocks);
        const dropZone = model.viewState.components['drop-zone'];
        return (
            <g>
                <DropZone
                    x={dropZone.x}
                    y={dropZone.y}
                    width={dropZone.w}
                    height={dropZone.h}
                    baseComponent="rect"
                    dropTarget={model.parent}
                    dropBefore={model}
                    renderUponDragStart
                    enableDragBg
                    enableCenterOverlayLine
                />

                <CompoundStatementDecorator
                    dropTarget={model}
                    bBox={bBox}
                    title={'Try'}
                    expression={expression}
                    editorOptions={this.editorOptions}
                    model={model}
                    body={model.body}
                />

                <g onClick={this.onAddCatchClick}>
                    <rect
                        x={model.viewState.components['statement-box'].x
                        + model.viewState.components['statement-box'].w
                        + model.viewState.bBox.expansionW - 10}
                        y={model.viewState.components['statement-box'].y
                        + model.viewState.components['statement-box'].h - 25}
                        width={20}
                        height={20}
                        rx={10}
                        ry={10}
                        className="add-catch-button"
                    />
                    <text
                        x={model.viewState.components['statement-box'].x
                        + model.viewState.components['statement-box'].w
                        + model.viewState.bBox.expansionW - 4}
                        y={model.viewState.components['statement-box'].y
                        + model.viewState.components['statement-box'].h - 15}
                        width={20}
                        height={20}
                        className="add-catch-button-label"
                    >
                        +
                    </text>
                </g>
                <g>
                {model.catchBlocks.map((catchBlock) => {
                    const editorOptions = {
                        propertyType: 'text',
                        key: 'Catch condition',
                        model: catchBlock,
                        getterMethod: () => { return catchBlock.getParameter().getSource(); },
                        setterMethod: (newValue) => { this.setCatchCondition(newValue, catchBlock); },
                    };

                    const expressiona = catchBlock.getParameter().getSource();

                    return (
                        <CompoundStatementDecorator
                            bBox={bBox}
                            title={'Catch'}
                            expression={expressiona}
                            model={catchBlock}
                            body={catchBlock.body}
                            editorOptions={editorOptions}
                        />
                    );
                })}
                    </g>
                {model.finallyBody &&
                <CompoundStatementDecorator
                    bBox={bBox}
                    title={'Finally'}
                    expression={expression}
                    model={model.finallyBody}
                    body={model.finallyBody}
                />
                }
            </g>
        );
    }
}

TryNode.propTypes = {
    model: PropTypes.instanceOf(TryNodeModel).isRequired,
    bBox: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        w: PropTypes.number.isRequired,
        h: PropTypes.number.isRequired,
    }),
};

TryNode.contextTypes = {
    mode: PropTypes.string,
};

export default TryNode;
