import React from "react";
import FormProvider, { useFormContext } from "./context/FormContext.js";

const TextInput = ({ value }) => {
  const [formState, setFormState] = useFormContext();
  return (
    <div className="field">
      {value}:{" "}
      <input
        value={formState[value]}
        onChange={(e) =>
          setFormState((state) => ({ ...state, [value]: e.target.value }))
        }
      />
    </div>
  );
};

const Display = ({ value }) => {
  const [formState] = useFormContext();
  return (
    <div className="value">
      {value}: {formState[value]}
    </div>
  );
};

const FormContainer = () => {
  return (
    <div className="container">
      <h5>FormContainer</h5>
      <TextInput value="first" />
      <TextInput value="last" />
    </div>
  );
};

const DisplayContainer = () => {
  return (
    <div className="container">
      <h5>DisplayContainer</h5>
      <Display value="first" />
      <Display value="last" />
    </div>
  );
};

const ContentContainer = () => {
  return (
    <div className="container">
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />
    </div>
  );
};

function App() {
  return (
    <FormProvider>
      <div className="container">
        <h5>App</h5>
        <ContentContainer />
      </div>
    </FormProvider>
  );
}

export default App;
