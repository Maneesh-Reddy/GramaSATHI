import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const MyApplications: React.FC = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [jobRequests, setJobRequests] = useState<any[]>([]);
    const [workers, setWorkers] = useState<any[]>([]);
    const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
    const [chatMessage, setChatMessage] = useState<string>('');
    const [confirmation, setConfirmation] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const { data: applicants } = await supabase.from('applicants').select('*');
            const { data: jobs } = await supabase.from('job_requests').select('*');
            const { data: workers } = await supabase.from('workers').select('*');

            setApplications(applicants || []);
            setJobRequests(jobs || []);
            setWorkers(workers || []);
        };

        fetchData();
    }, []);

    const getWorkerApplications = () => {
        if (!selectedWorkerId) return [];
        return applications
            .filter(app => app.worker_id === selectedWorkerId)
            .map(app => {
                const job = jobRequests.find(j => j.id === app.job_id);
                return {
                    ...app,
                    jobTitle: job?.title,
                    jobLocation: job?.location,
                    jobDate: job?.date,
                };
            });
    };

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            setConfirmation(`✅ Message sent: "${chatMessage}"`);
            setChatMessage('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-primary-600 mb-4">My Applications</h1>

            <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Select Worker:</label>
                <select
                    className="p-2 border rounded w-full max-w-sm"
                    onChange={(e) => setSelectedWorkerId(parseInt(e.target.value))}
                    defaultValue=""
                >
                    <option value="" disabled>-- Choose Worker --</option>
                    {workers.map((worker: any) => (
                        <option key={worker.id} value={worker.id}>
                            {worker.name} ({worker.skill} - {worker.location})
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-4 mb-6">
                {getWorkerApplications().length === 0 ? (
                    <p>No applications found.</p>
                ) : (
                    getWorkerApplications().map((app, idx) => (
                        <div key={idx} className="border rounded p-4 shadow">
                            <p><strong>Job:</strong> {app.jobTitle}</p>
                            <p><strong>Location:</strong> {app.jobLocation}</p>
                            <p><strong>Date:</strong> {app.jobDate}</p>
                            <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${app.status === 'Selected' ? 'bg-green-200' : app.status === 'Rejected' ? 'bg-red-200' : 'bg-yellow-100'}`}>{app.status}</span></p>
                        </div>
                    ))
                )}
            </div>

            <div className="border-t pt-4">
                <h2 className="text-lg font-semibold mb-2">Have a Question?</h2>
                <textarea
                    className="w-full border p-2 rounded mb-2"
                    rows={3}
                    placeholder="Type a message or confirmation request..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Send
                </button>
                {confirmation && <p className="mt-2 text-green-700">{confirmation}</p>}
            </div>
        </div>
    );
};

export default MyApplications;
