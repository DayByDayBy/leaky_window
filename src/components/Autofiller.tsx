import React, { useState } from 'react';
import './Autofiller.css';

const Autofiller: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleAutofillClick = async () => {
        if ('credentials' in navigator) {
            try {
                const credential = await navigator.credentials.get();

                if (credential && (credential as any).name) {
                    setName((credential as any).name); 
                }
                if (credential && (credential as any).email) {
                    setEmail((credential as any).email);
                }
            } catch (error) {
                console.error('Error retrieving credentials:', error);
            }
        } else {
            console.warn('Credentials API not supported.');
        }
    };

    return (
        <div className='greeter'>
            <h1>hello, {name ? name : 'friend'}!</h1>
            <button onClick={handleAutofillClick}>
                Click Me
            </button>
            {email && (
                <p>is your email still {email}?</p>
            )}
        </div>
    );
};

export default Autofiller;
