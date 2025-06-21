import React, { useEffect, useState, useCallback } from 'react';
import type { AppExtensionSDK } from '@contentful/app-sdk';
import type { EntryProps } from 'contentful-management';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { reorderComponents, setInitialState, undo, redo, updateHistory, type Component } from '../features/layout/layoutSlice';
import './LayoutEditor.css';
import { debounce } from 'lodash';
import AddComponentPanel from './AddComponentPanel';

interface LayoutEditorProps {
  sdk: AppExtensionSDK;
}

const LAYOUT_FIELD_ID = 'layoutConfig';

const LayoutEditor: React.FC<LayoutEditorProps> = ({ sdk }) => {
  const dispatch = useAppDispatch();
  const { components, history } = useAppSelector((state) => state.layout);
  const [entry, setEntry] = useState<EntryProps | null>(null);

  // --- Contentful Integration ---
  useEffect(() => {
    const getEntry = async () => {
      // The `entry` id is available in the `ids` object when the
      // app is opened from an entry.
      const entryId = (sdk.ids as any).entry;
      if (entryId) {
        const entryData = await sdk.space.getEntry(entryId);
        setEntry(entryData);
        const layout = entryData.fields[LAYOUT_FIELD_ID]?.['en-US'] || [];
        dispatch(setInitialState(layout));
        dispatch(updateHistory());
      }
    };
    getEntry();
  }, [sdk, dispatch]);

  const saveLayout = useCallback(
    debounce(async (layout: Component[], currentEntry: EntryProps) => {
      if (!currentEntry) return;
      try {
        currentEntry.fields[LAYOUT_FIELD_ID] = { 'en-US': layout };
        const updatedEntry = await sdk.space.updateEntry(currentEntry);
        setEntry(updatedEntry); // Update entry state with the new version
        sdk.notifier.success('Layout saved!');
      } catch (error) {
        console.error(error);
        sdk.notifier.error('Error saving layout.');
      }
    }, 1000),
    [sdk]
  );

  useEffect(() => {
    if (entry && history.present.length > 0) {
      saveLayout(components, entry);
    }
  }, [components, entry, saveLayout, history.present.length]);


  // --- Drag and Drop ---
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    dispatch(reorderComponents(result));
    dispatch(updateHistory());
  };

  if (!entry) {
    return <div>Loading layout editor...</div>;
  }

  return (
    <div>
        <div className="controls">
            <button onClick={() => dispatch(undo())} disabled={history.past.length <= 1}>Undo</button>
            <button onClick={() => dispatch(redo())} disabled={history.future.length === 0}>Redo</button>
        </div>
        <hr />
        <AddComponentPanel sdk={sdk} />
        <hr />
        <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="components">
            {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="droppable-area">
                {components.map((component, index) => (
                <Draggable key={component.id} draggableId={component.id} index={index}>
                    {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="draggable-item"
                    >
                        {component.type} (ID: {component.contentId})
                    </div>
                    )}
                </Draggable>
                ))}
                {provided.placeholder}
            </div>
            )}
        </Droppable>
        </DragDropContext>
    </div>
  );
};

export default LayoutEditor; 