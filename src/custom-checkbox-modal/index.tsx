import { useEffect, useState } from 'react';
import { Checkbox, Col, Modal, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { CloseOutlined } from '@ant-design/icons';

interface ICheckboxItem {
    label: string;
    value: string;
    isChecked: boolean;
}
interface IProps {
    onCloseModal: () => void;
    checkboxList: Array<ICheckboxItem>;
    setCheckboxList: (checkboxItem: Array<ICheckboxItem>) => void
}

export default function CustomModal(props: IProps) {
    const { onCloseModal, checkboxList, setCheckboxList } = props;
    const [groupValue, setGroupValue] = useState(checkboxList.filter((item: ICheckboxItem) => item.isChecked).map((item: any) => item.value));
    const [indeterminate, setIndeterminate] = useState<boolean | null>(null); // 初始值设为 null
    const [checkAll, setCheckAll] = useState(false);
    useEffect(() => {
        // 计算部分选中的数量
        const partialCheckedCount = checkboxList.filter(item => item.isChecked).length;
        // 如果部分选中的数量不为0且不等于总数量，则设置indeterminate为true
        setIndeterminate(partialCheckedCount !== 0 && partialCheckedCount !== checkboxList.length);
    }, []);
    const handleOk = () => {
        console.log('handleOk');
    }
    // 单选
    const handleChange = (checkedVal: Array<string>) => {
        // 更新 isChecked 状态
        const updatedList: Array<ICheckboxItem> = checkboxList.map((item: ICheckboxItem) => ({
            ...item,
            isChecked: checkedVal.includes(item.value)
        }));
        setCheckboxList(updatedList);
        // 更新 Checkbox.Group 的 value
        setGroupValue(checkedVal);
        // 更新全选和部分选中状态
        // 获取选中的数量
        const checkedCount = updatedList.filter(item => item.isChecked).length;
        // 当选中的值和所有值的长度一样 即全选。
        const isAllChecked = checkedCount === updatedList.length;
        // 当选中的值大于0 且 选中的数量小于总数  即部分选中。
        const isPartialChecked = checkedCount > 0 && checkedCount < updatedList.length;
        setCheckAll(isAllChecked);
        setIndeterminate(isPartialChecked);
    }
    // 全选
    const handleCheckAllChange = (e: CheckboxChangeEvent) => {
        const isCheckedAll = e.target.checked;
        setCheckAll(isCheckedAll);
        setIndeterminate(false);
        // 更新所有复选框的isChecked状态和groupValue的值
        const updatedList = checkboxList.map((item: ICheckboxItem) => ({
            ...item,
            isChecked: isCheckedAll
        }));
        const updatedGroupValue = isCheckedAll ? checkboxList.map((item: ICheckboxItem) => item.value) : [];
        setCheckboxList(updatedList);
        setGroupValue(updatedGroupValue);
    };
    // 全部清除
    const handleClearAll = () => {
        // 将复选框列表的 isChecked 属性全部设置为 false
        const updatedList: ICheckboxItem[] = checkboxList.map(item => ({
            ...item,
            isChecked: false
        }));

        // 更新 Checkbox.Group 的 value 为空数组
        setCheckboxList(updatedList);
        setGroupValue([]);
        // 更新全选状态为 false，部分选中状态为 false
        setCheckAll(false);
        setIndeterminate(false);
    };
    // 单个清除
    const handleSingleDelete = (deletedCheckbox: ICheckboxItem) => {
        // 找到被删除的复选框在列表中的索引
        const index = checkboxList.findIndex(item => item.value === deletedCheckbox.value);

        // 如果被删除的复选框是选中状态，则更新 groupValue
        const updatedGroupValue = groupValue.filter(value => value !== deletedCheckbox.value);
        setGroupValue(updatedGroupValue);

        // 更新删除的复选框的 isChecked 值
        const updatedList = [...checkboxList];
        updatedList[index].isChecked = false;
        // 更新复选框列表
        setCheckboxList(updatedList);
        // 更新全选状态和部分选中状态
        const checkedCount = updatedList.filter(item => item.isChecked).length;
        const isAllChecked = checkedCount === updatedList.length;
        const isPartialChecked = checkedCount > 0 && checkedCount < updatedList.length;
        setCheckAll(isAllChecked);
        setIndeterminate(isPartialChecked);
    };

    // 当没有indeterminate 不展示
    if (indeterminate === null) return null;
    return (
        <Modal
            width={800}
            open
            title='Checkbox'
            okText='Confirm'
            onCancel={() => onCloseModal()}
            onOk={() => handleOk()}
        >
            <div className='container'>
                <div className='checkbox-wrap'>
                    <div className='title'>
                        <span>List of data metrics</span>
                    </div>
                    <div className='content'>
                        <Row>
                            <Checkbox indeterminate={indeterminate} onChange={handleCheckAllChange} checked={checkAll}>
                                Check all
                            </Checkbox>
                        </Row>
                        <Checkbox.Group style={{ width: '100%' }} onChange={handleChange} value={groupValue}>
                            <Row>
                                {
                                    checkboxList.map((item, index) => (
                                        <Col span={8} key={index}>
                                            <Checkbox value={item.value}>{item.label}</Checkbox>
                                        </Col>
                                    ))
                                }
                            </Row>
                        </Checkbox.Group>
                    </div>
                </div>
                <div className='selected-wrap'>
                    <div className='title'>
                        <span className='clear' onClick={handleClearAll}>Clear All</span>
                    </div>
                    <div className='content'>
                        {
                            checkboxList.filter((item: ICheckboxItem) => item.isChecked).map((item, index) => (
                                <div className='selected' key={index}>
                                    <span>{item.label}</span>
                                    <CloseOutlined
                                        onClick={() => handleSingleDelete(item)}
                                        style={{cursor: 'pointer'}}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )
}
