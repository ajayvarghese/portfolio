import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ContactMe.css';

const FormField = ({ label, type, onChange, inputProps }) => (
  <label className={styles.field}>
    { label && <span className={styles.label}>{label}</span>}
    { type === 'textarea' ? 
      <textarea className={styles.textarea} onChange={onChange} /> : 
      <input {...inputProps} type={type} className={type === 'submit' ? styles.submit : styles.input} onChange={onChange} />
    }
  </label>
);

FormField.propTypes = {
  label: 'Label',
  type: 'text',
}

const ContactMe = () => {
  const [ formVisibility, setFormVisibility ] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted', e.target)
  }

  return (
    <div className={styles.wrapper}>
      <button class={styles.contact_btn} onClick={() => setFormVisibility(!formVisibility)}>Contact Me</button>
      {formVisibility &&
        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <h2 className={styles.form_header}>Stay in touch...</h2>
          <FormField
            label="Name"
            onChange={handleInputChange}
            inputProps={{ required: true }}
          />
          <FormField
            label="Email Id"
            type="email"
            inputProps={{ required: true }}
            onChange={handleInputChange}
          />
          <FormField
            label="Message"
            type="textarea"
            inputProps={{ required: true }}
            onChange={handleInputChange}
          />
          <FormField
            type="submit"
          />
        </form>
      }
    </div>
  );
}

export default ContactMe;