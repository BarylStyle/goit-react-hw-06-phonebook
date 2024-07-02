import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { saveContact, deleteContact, setFilter } from '../features/contactsSlice';
import styles from './Contacts/Contact.module.scss';

const Contacts = () => {
  const contacts = useSelector(state => state.contacts.contacts) || [];
  const filter = useSelector(state => state.contacts.filter) || '';
  const dispatch = useDispatch();

  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      const contacts = JSON.parse(savedContacts);
      contacts.forEach(contact => dispatch(saveContact(contact)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleChange = ev => {
    const { name, value } = ev.target;
    if (name === 'filter') {
      dispatch(setFilter(value));
    }
  };

  const handleSubmit = ev => {
    ev.preventDefault();
    const form = ev.target;
    const name = form.name.value;
    const number = form.number.value;

    const isDuplicate = contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase());

    if (isDuplicate) {
      alert(`Kontakt o nazwie "${name}" już istnieje.`);
      return;
    }

    const isValidNumber = /^[0-9]+$/.test(number);

    if (!isValidNumber) {
      alert('Numer telefonu musi zawierać tylko cyfry.');
      return;
    }

    dispatch(saveContact({ id: nanoid(), name, number }));
    form.reset();
  };

  const handleDelete = id => {
    dispatch(deleteContact(id));
  };

  const nameId = nanoid();
  const numId = nanoid();
  const searchId = nanoid();

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor={nameId}>Imię</label>
        <input
          id={nameId}
          type="text"
          name="name"
          required
        />
        <label htmlFor={numId}>Numer telefonu.</label>
        <input
          id={numId}
          type="tel"
          name="number"
          required
          pattern="[0-9]*"
          title="Numer telefonu musi zawierać tylko cyfry."
        />
        <button type="submit">Dodaj kontakt</button>
      </form>
      <h1>Kontakty</h1>
      <form className={styles.searchForm}>
        <label htmlFor={searchId}>Szukaj kontaktu</label>
        <input
          type="text"
          id={searchId}
          name="filter"
          value={filter}
          onChange={handleChange}
        />
      </form>
      <ul className={styles.list}>
        {contacts
          .filter(el => el.name.toLowerCase().includes(filter.toLowerCase()))
          .map(contact => (
            <li key={contact.id}>
              {contact.name} - {contact.number}
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleDelete(contact.id)}
              >
                Usuń
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Contacts;