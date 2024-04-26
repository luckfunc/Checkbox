import CustomModal from './custom-checkbox-modal';
import { useState } from 'react';

export default function App() {
    const [showModal, setShowModal] = useState(true);
    const [checkboxList, setCheckboxList] = useState( [
        {
            label: 'Date',
            value: 'Date',
            isChecked: true
        },
        {
            label: 'FillRate',
            value: 'FillRate',
            isChecked: false
        },
        {
            label: 'Clicks',
            value: 'Clicks',
            isChecked: false
        }
    ]);

	return (
        <>
            {
                showModal ? <CustomModal onCloseModal={() => setShowModal(false)} checkboxList={checkboxList} setCheckboxList={setCheckboxList} /> : null
            }
        </>
	);
}
