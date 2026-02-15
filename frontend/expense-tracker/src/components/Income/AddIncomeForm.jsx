import React, { useState } from 'react';
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../EmojiPickerPopup';

const AddIncomeForm = ({ onAddIncome }) => {
  // Fix: useState returns [state, setState], not {state, setState}
  const [income, setIncome] = useState({
    source: '',
    amount: '',
    date: '',
    icon: '',
  });

  const handleChange = (key, value) => setIncome({ ...income, [key]: value });

  // Fix: call the onAddIncome prop function, not the component name
  const handleAddIncome = () => {
    if (onAddIncome) {
      onAddIncome(income);
      // Optionally reset form after add
      setIncome({ source: '', amount: '', date: '', icon: '' });
    }
  };

  return (
    <div>

        <EmojiPickerPopup
            icon= {income.icon}
            onSelect= {(selectedIcon) => handleChange("icon", selectedIcon)}
            />
      <Input
        value={income.source}
        onChange={({ target }) => handleChange('source', target.value)}
        label="Income source"
        placeholder="Freelance, Salary, etc"
        type="text"
      />
      <Input
        value={income.amount}
        onChange={({ target }) => handleChange('amount', target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />
      <Input
        value={income.date}
        onChange={({ target }) => handleChange('date', target.value)}
        label="Date"
        placeholder=""
        type="date"
      />
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleAddIncome}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
