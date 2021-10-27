import React, { createContext, useState } from 'react';
import { formConfig } from '../data/form';
import CustomForm from './CustomForm';

export const FormContext = createContext(null);

const Home = ({ logout }) => {
  const [elements, setElements] = useState([]);
  const handleChange = (FormId, value) => {
    const newElements = [...formConfig];
    newElements.forEach((form) => {
      if (FormId === form.id) {
        form['value'] = value;
      }
      setElements(newElements);
    });
    console.log(newElements);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(elements, 'submitted');
  };
  return (
    <section className="hero">
      <nav>
        <h2>Welcome</h2>
        <button onClick={logout}>Logout</button>
      </nav>
      <div className="center">
        <div className="form">
          <h1>Custom Dynamic Form</h1>
          <FormContext.Provider value={{ handleChange }}>
            <CustomForm
              config={formConfig}
              FormContext={FormContext}
              handleSubmit={handleSubmit}
              // button={<button type="submit"> submit</button>}
            />
          </FormContext.Provider>
        </div>
      </div>
    </section>
  );
};

export default Home;
