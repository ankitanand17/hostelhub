// client/src/pages/admin/AllStudentsPage.tsx
import StudentList from '../../components/dashboard/StudentList';

const AllStudentsPage = () => {
    return (
        <div className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
            <StudentList />
        </div>
    );
};

export default AllStudentsPage;