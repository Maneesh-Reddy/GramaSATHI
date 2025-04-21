import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // 👈 use one dot, not two

const AddWorker: React.FC = () => {
    const navigate = useNavigate();

    const [worker, setWorker] = useState({
        name: '',
        skill: '',
        availability: '',
        location: '',
        contact: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorker({ ...worker, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase.from('workers').insert([worker]);

        if (error) {
            alert("❌ Failed to add worker: " + String(error));
        } else {
            alert("✅ Worker registered successfully!");
            navigate('/rozgar');
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary-600 mb-6">Register as Worker</h1>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <input type="text" name="name" placeholder="Full Name" required className="p-2 border rounded" onChange={handleChange} />
                <input type="text" name="skill" placeholder="Skill (e.g. Mason)" required className="p-2 border rounded" onChange={handleChange} />
                <input type="text" name="availability" placeholder="Availability (Daily/Weekly)" required className="p-2 border rounded" onChange={handleChange} />
                <input type="text" name="location" placeholder="Location" required className="p-2 border rounded" onChange={handleChange} />
                <input type="tel" name="contact" placeholder="Contact Number" required className="p-2 border rounded" onChange={handleChange} />
                <button type="submit" className="bg-primary-600 text-white py-2 rounded hover:bg-primary-700">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddWorker;
