import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';

export default function LoginPage() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();
setError('');
try {
    const data = await login(email, password);

    if (data.user?.role === 'admin') {
    navigate('/admin');
    } else {
    navigate('/student');
    }
} catch (err) {
    setError(err.message);
}
};

return (
<div style={{ maxWidth: '400px', margin: '50px auto' }}>
    <h2>Connexion</h2>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <form onSubmit={handleSubmit}>
    <div>
        <label>Email :</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    </div>
    <div>
        <label>Mot de passe :</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
    </div>
    <button type="submit">Se connecter</button>
    </form>
</div>
);
}