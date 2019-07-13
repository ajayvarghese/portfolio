import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ContactMe.css';

const FormField = ({ label, type, onChange, inputProps, name }) => (
  <label className={styles.field}>
    { label && <span className={styles.label}>{label}</span>}
    { type === 'textarea' ? 
      <textarea className={styles.textarea} onChange={onChange} name={name}/> :
      <input
        {...inputProps}
        type={type}
        className={type === 'submit' ? styles.submit : styles.input} onChange={onChange}
        name={name}
      />
    }
  </label>
);

FormField.propTypes = {
  label: 'Label',
  type: 'text',
}

const ContactMe = () => {
  const [ formVisibility, setFormVisibility ] = useState(false);
  const [ formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted', e.target);
    const { email, name, message, phone } = formData;
    fetch('/mail/send-mail', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message, phone })})
      .then(r => {
        if(r.status === 200){
          setFormSubmitted({ type: 'success', message: 'Thank You, Message sent successfully :)'});
        } else {
          setFormSubmitted({ type: 'error', message: 'Uh oh, Something happened... :('});
        }
        return r.text();
      })
  };

  useEffect(() => {
    function clickHandler(e) {
      console.log(!e.path.includes(document.getElementById('form')), formVisibility, !e.path.includes(document.getElementById('form')) && formVisibility);
      if (!e.path.includes(document.getElementById('form')) && !e.path.includes(document.getElementById('contactMeBtn'))) {
        console.log('In');
        setFormVisibility(false)
      }
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  }, []);

  return (
    <div className={styles.wrapper}>
      <button id="contactMeBtn" className={styles.contact_btn} onClick={() => setFormVisibility(!formVisibility)}>Contact Me</button>
      {formVisibility &&
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          id={'form'}
        >
          <h2 className={styles.form_header}>Stay in touch...</h2>
          {formSubmitted ?
            <div className={formSubmitted.type === 'success' ? styles.success_msg : styles.error_msg}>
              <span className={formSubmitted.type === 'success' ? styles['tick-icon'] : styles['error-icon']}/>
              {formSubmitted.message}
            </div> :
            <>
              <FormField
              label="Name"
              onChange={handleInputChange}
              inputProps={{ required: true }}
              name="name"
            />
            <FormField
              label="Email Id"
              type="email"
              inputProps={{ required: true }}
              onChange={handleInputChange}
              name="email"
            />
            <FormField
              label="Phone No."
              type="number"
              inputProps={{ required: true }}
              onChange={handleInputChange}
              name="phone"
            />
            <FormField
              label="Message"
              type="textarea"
              inputProps={{ required: true }}
              onChange={handleInputChange}
              name="message"
            />
            <FormField
              type="submit"
            />
          </>}
        </form>
      }
    </div>
  );
}

export default ContactMe;