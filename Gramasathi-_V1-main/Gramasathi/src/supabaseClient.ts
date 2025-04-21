// Mock Supabase client for development
// Replace with actual Supabase setup in production


// const mockWorkers = [
//   { id: 1, name: 'Rajesh Kumar', skill: 'Construction', availability: 'Weekdays', location: 'Village A', contact: '9876543210' },
//   { id: 2, name: 'Sunita Devi', skill: 'Farming', availability: 'All days', location: 'Village B', contact: '9876543211' },
//   { id: 3, name: 'Mohan Singh', skill: 'Plumbing', availability: 'Weekends', location: 'Village A', contact: '9876543212' },
//   { id: 4, name: 'Priya Sharma', skill: 'Electrician', availability: 'All days', location: 'Village C', contact: '9876543213' },
//   { id: 5, name: 'Amit Patel', skill: 'Carpentry', availability: 'Weekdays', location: 'Village B', contact: '9876543214' },
// ];

// const mockJobRequests: any[] = [
//   { id: 1, title: 'Build House Foundation', skill: 'Construction', location: 'Village A', date: '2023-06-15', slots: 3, filled: 1 },
//   { id: 2, title: 'Harvest Season Help', skill: 'Farming', location: 'Village B', date: '2023-06-20', slots: 5, filled: 2 }
// ];

// const mockApplicants: any[] = [
//   { id: 1, job_id: 1, worker_id: 1, status: 'Selected' },
//   { id: 2, job_id: 2, worker_id: 2, status: 'Pending' },
//   { id: 3, job_id: 2, worker_id: 3, status: 'Pending' }
// ];

// export const supabase = {
//   from: (table: string) => ({
//     select: (columns: string = '*') => {
//       if (table === 'workers') {
//         return Promise.resolve({ data: mockWorkers, error: null });
//       } else if (table === 'job_requests') {
//         return Promise.resolve({ data: mockJobRequests, error: null });
//       } else if (table === 'applicants') {
//         return Promise.resolve({ data: mockApplicants, error: null });
//       }
//       return Promise.resolve({ data: [], error: null });
//     },
//     insert: (data: any) => {
//       if (table === 'job_requests') {
//         // Add IDs to mock items
//         const itemsWithIds = Array.isArray(data) ? data : [data];
//         itemsWithIds.forEach((item, index) => {
//           item.id = mockJobRequests.length + index + 1;
//           mockJobRequests.push(item);
//         });
//         return Promise.resolve({ data: itemsWithIds, error: null });
//       } else if (table === 'applicants') {
//         const itemsWithIds = Array.isArray(data) ? data : [data];
//         itemsWithIds.forEach((item, index) => {
//           item.id = mockApplicants.length + index + 1;
//           mockApplicants.push(item);
//         });
//         return Promise.resolve({ data: itemsWithIds, error: null });
//       }
//       return Promise.resolve({ data, error: null });
//     },
//     update: (data: any) => {
//       return Promise.resolve({ data, error: null });
//     },
//     delete: () => {
//       return Promise.resolve({ data: null, error: null });
//     },
//   }),
// };

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lazqwijhpohncnwqtfza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhenF3aWpocG9obmNud3F0ZnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMjgyODQsImV4cCI6MjA2MDcwNDI4NH0.xJ05Qn7sCq7SEuBEhyjF_RKMtD40wkJPfsknHJNzaBA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);