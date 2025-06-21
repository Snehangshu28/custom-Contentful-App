import React from 'react';
import type { AppExtensionSDK } from '@contentful/app-sdk';
import { useAppDispatch } from '../hooks/redux';
import { addComponent } from '../features/layout/layoutSlice';
import { v4 as uuidv4 } from 'uuid';
import './AddComponentPanel.css';

interface AddComponentPanelProps {
    sdk: AppExtensionSDK;
}

const AddComponentPanel: React.FC<AddComponentPanelProps> = ({ sdk }) => {
    const dispatch = useAppDispatch();

    const handleAddComponent = async (contentTypeId: string) => {
        try {
            const newEntry = await sdk.space.createEntry(contentTypeId, {
                fields: {
                    internalName: { 'en-US': `New ${contentTypeId}` },
                }
            });

            dispatch(addComponent({
                id: uuidv4(),
                type: contentTypeId,
                contentId: newEntry.sys.id,
            }));

            sdk.notifier.success(`New ${contentTypeId} component added.`);
        } catch (error) {
            console.error(error);
            sdk.notifier.error(`Error adding ${contentTypeId} component.`);
        }
    };

    return (
        <div className="add-component-panel">
            <h3>Add New Component</h3>
            <button onClick={() => handleAddComponent('heroBlock')}>Hero Block</button>
            <button onClick={() => handleAddComponent('twoColumnRow')}>Two Column Row</button>
            <button onClick={() => handleAddComponent('imageGrid')}>2x2 Image Grid</button>
        </div>
    );
};

export default AddComponentPanel; 