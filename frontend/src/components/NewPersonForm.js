import React from 'react';

const NewPersonForm = ({ addPerson, newName, inputName, inputPhone, newPhone }) => {


    return (
        <form onSubmit={addPerson}>
            <div>
                <h1>Add a new</h1>
                name: <input
                    value={newName}
                    onChange={inputName} /> <br />
                number: <input
                    value={newPhone}
                    onChange={inputPhone} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default NewPersonForm;