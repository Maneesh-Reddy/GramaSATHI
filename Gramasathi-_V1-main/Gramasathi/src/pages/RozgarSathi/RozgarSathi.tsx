import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { supabase } from "../../supabaseClient"; // ⬅ Go up two levels from /pages/RozgarSathi

const RozgarSathi: React.FC = () => {
  const { t } = useTranslation();

  const [workers, setWorkers] = useState<any[]>([]);
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      const { data, error } = await supabase.from('workers').select('*');
      if (error) {
        console.error('Error fetching workers:', error);
      } else {
        setWorkers(data || []);
      }
    };

    fetchWorkers();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSkillFilter(e.target.value);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedWorkerIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredWorkers = workers.filter(worker =>
    (!skillFilter || worker.skill === skillFilter) &&
    (!locationFilter || worker.location === locationFilter)
  );

  const selectedWorkers = workers.filter(worker => selectedWorkerIds.includes(worker.id));

  const uniqueSkills = [...new Set(workers.map((w: any) => w.skill))];
  const uniqueLocations = [...new Set(workers.map((w: any) => w.location))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-primary-600">Razgor Sathi - Hire Workers</h1>
      <p className="mt-2 text-lg text-gray-600">Select and contact daily wage workers for your needs.</p>

      {/* Filters + Buttons */}
      <div className="mt-4 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <select
            className="px-3 py-2 rounded-md bg-primary-100 text-primary-600"
            value={skillFilter}
            onChange={handleFilterChange}
          >
            <option value="">Filter by Skill</option>
            {uniqueSkills.map((skill, idx) => (
              <option key={idx} value={skill}>{skill}</option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded-md bg-primary-100 text-primary-600"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">Filter by Location</option>
            {uniqueLocations.map((loc, idx) => (
              <option key={idx} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 flex-wrap">
          <Link to="/add-worker" className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-400">
            <PlusCircle className="inline-block mr-2" size={20} /> Add Worker
          </Link>

          <Link to="/job-board" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            View Available Job Requests
          </Link>

          <Link to="/add-job-request" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400">
            <PlusCircle className="inline-block mr-2" size={20} /> Post Job Request
          </Link>

          <Link to="/my-jobs" className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
            My Applications
          </Link>
        </div>
      </div>

      {/* Selected Workers Info */}
      {selectedWorkerIds.length > 0 && (
        <div className="mt-6 bg-green-100 border border-green-400 text-green-700 p-4 rounded">
          <h2 className="font-bold mb-2">Selected Workers:</h2>
          {selectedWorkers.map(worker => (
            <p key={worker.id}>
              📞 <strong>{worker.name}</strong> – <a href={`tel:${worker.contact}`} className="text-blue-600">{worker.contact}</a>
            </p>
          ))}

          <div className="mt-4">
            <button
              onClick={() => {
                const message = `Hi! I want to hire the following workers:\n\n${selectedWorkers
                  .map(w => `• ${w.name} (${w.skill}) - ${w.contact}`)
                  .join('\n')}`;

                const encodedMsg = encodeURIComponent(message);
                const whatsappNumber = '916304570760';
                window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, '_blank');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md"
            >
              Hire Selected Workers via WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Worker Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <div key={worker.id} className="bg-white shadow-lg rounded-md p-4 relative">
            <input
              type="checkbox"
              className="absolute top-2 left-2"
              checked={selectedWorkerIds.includes(worker.id)}
              onChange={() => handleCheckboxChange(worker.id)}
            />
            <h2 className="font-semibold text-xl text-primary-600">{worker.name}</h2>
            <p className="mt-2 text-sm text-gray-600">Skill: {worker.skill}</p>
            <p className="text-sm text-gray-500">Availability: {worker.availability}</p>
            <p className="text-sm text-gray-500">Location: {worker.location}</p>
            <p className="text-sm text-gray-500">Contact: <a href={`tel:${worker.contact}`} className="text-blue-600">{worker.contact}</a></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RozgarSathi;