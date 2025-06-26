import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import type { User } from '../../types';
import PromoteStudentModal from '../modals/PromoteStudentModal';
import DemoteStudentModal from '../modals/DemoteStudentModal';

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

    const [selectedStudent, setSelectedStudent] = useState<StudentWithProfile | null>(null);
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    const [isDemoteModalOpen, setIsDemoteModalOpen] = useState(false);

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/users/students?search=${search}`);
            setStudents(response.data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setIsLoading(false);
        }
    }, [search]);
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchStudents();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [fetchStudents]);

    const handleOpenPromoteModal = (student: StudentWithProfile) => {
        setSelectedStudent(student);
        setIsPromoteModalOpen(true);
    };
    
    const handleOpenDemoteModal = (student: StudentWithProfile) => {
        setSelectedStudent(student);
        setIsDemoteModalOpen(true);
    };

    const handleCloseModals = () => {
        setSelectedStudent(null);
        setIsPromoteModalOpen(false);
        setIsDemoteModalOpen(false);
    };

    const handleActionSuccess = () => {
        fetchStudents();
    };

    const handleRoleClick = (student: StudentWithProfile) => {
        if (student.role === 'STUDENT') {
            handleOpenPromoteModal(student);
        } else {
            handleOpenDemoteModal(student);
        }
    };

    return (
        <>
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
                                        <td className="td-style">
                                            <button 
                                            onClick={() => handleRoleClick(student)} 
                                            className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                                                student.role === 'STUDENT' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blue-200 text-blue-800 hover:bg-red-200 hover:text-red-800'
                                            }`}
                                            title={student.role === 'STUDENT' ? 'Promote Student' : 'Demote Student'}
                                        >
                                            {student.role}
                                        </button>
                                        </td>
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
            {selectedStudent && (
                <>
                    <PromoteStudentModal
                        isOpen={isPromoteModalOpen}
                        onClose={handleCloseModals}
                        studentUserId={selectedStudent.id}
                        studentName={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                        onPromotionSuccess={handleActionSuccess}
                    />
                    <DemoteStudentModal
                        isOpen={isDemoteModalOpen}
                        onClose={handleCloseModals}
                        studentUserId={selectedStudent.id}
                        studentName={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                        currentRole={selectedStudent.role}
                        onDemotionSuccess={handleActionSuccess}
                    />
                </>
            )}
        </>
    );
};

export default StudentList;