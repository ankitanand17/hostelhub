import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import type { User } from '../../types';

// Extend the User type for this component's specific data
type StudentWithProfile = User & {
    studentProfile: {
        id: string;
        rollNumber: string;
        roomNumber: string | null;
        _count: { disciplinaryActions: number };
    } | null;
};

const StudentList = () => {
    const [students, setStudents] = useState<StudentWithProfile[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/users/students?search=${search}`);
                setStudents(response.data);
            } catch (error) {
                console.error("Failed to fetch students", error);
            } finally {
                setIsLoading(false);
            }
        };
        const delayDebounce = setTimeout(() => {
            fetchStudents();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800">All Students</h3>
            <div className="my-4">
                <input
                    type="text"
                    placeholder="Search by name, roll no, or room no..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-black"
                />
            </div>

            {isLoading ? (
                <p>Loading students...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="th-style">Name</th>
                                <th className="th-style">Roll Number</th>
                                <th className="th-style">Room</th>
                                <th className="th-style">Role</th>
                                <th className="th-style text-center">Discipline</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="td-style">
                                        <Link to={`/student/${student.studentProfile?.id}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                                            {student.firstName} {student.lastName}
                                        </Link>
                                    </td>
                                    <td className="td-style">{student.studentProfile?.rollNumber || 'N/A'}</td>
                                    <td className="td-style">{student.studentProfile?.roomNumber || 'N/A'}</td>
                                    <td className="td-style">{student.role}</td>
                                    <td className="td-style text-center">
                                        <Link to={`/student/${student.studentProfile?.id}/actions`} title="View Disciplinary Actions">
                                            <span className={`inline-block w-4 h-4 rounded-full ${ (student.studentProfile?._count.disciplinaryActions ?? 0) > 0 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {students.length === 0 && !isLoading && <p className="mt-4 text-center text-gray-500">No students found.</p>}
        </div>
    );
};

export default StudentList;