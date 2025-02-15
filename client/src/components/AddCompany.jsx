import React, {useState} from 'react'
import { addCompany } from '../redux/companyReducer';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa6';
import { useAddCompanyMutation } from '../redux/companyApiSlice';

const AddCompany = () => {
    // MARK: State
    const [isOpen, setIsOpen ] = useState(false)
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('Submitted');
    const [city, setCity] = useState('');
    const [link, setLink] = useState('');
    const [applyDate, setApplyDate] = useState('');
    const [addCompany, {isLoading}] = useAddCompanyMutation();
    const formattedDate = new Date(applyDate).toLocaleDateString('en-US');

    // MARK: Dispatch
    const { userInfo } = useSelector((state) => state.authReducer)
    const dispatch = useDispatch();
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name || !role || !status || !city || !link || !applyDate) {
            toast.error('Please fill out all fields');
            return;
        }
        try {
            const newCompany = {
                name,
                role,
                status,
                city,
                link,
                applyDate: formattedDate,
                updatedAt: new Date().toISOString(),
                user: userInfo._id,
            };
            console.log(newCompany);
    
            const res = await addCompany(newCompany).unwrap();
            setIsOpen(false);
            toast.success('Company added successfully!');
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.msg || 'Failed to add company');
        }
    };
return (
    <div>
        {/* Add Button */}
        <div className="shrink-0">
            <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 bg-opacity-80 hover:bg-opacity-100 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
            <FaPlus aria-hidden="true" className="-ml-0.5 h-5 w-5" />
            New Application
            </button>
        </div>
        {/* Modal */}
        {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="edit">
            <h2 className="text-2xl font-bold mb-4">New Application</h2>
            <form onSubmit={handleAdd} className='flex flex-col p-2'>
                <div className="form-control">
                <label className="label">
                    <span className="p-1 label-text">Name</span>
                </label>
                <input
                    type="text"
                    className="input w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                </div>

                <div className="form-control mt-1">
                <label className="label">
                    <span className="p-1 label-text">Role</span>
                </label>
                <input
                    type="text"
                    className="input w-full"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />
                </div>
                <div className='flex flex-row justify-between gap-2'>
                <div className="form-control mt-1 w-full">
                    <label className="label">
                    <span className="p-1 label-text">Status</span>
                    </label>
                    <select
                    className="select select-bordered w-full"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    >
                    <option value="Submitted">Submitted</option>
                    <option value="OA">OA</option>
                    <option value="Interview1">Interview Round 1</option>
                    <option value="Interview2">Interview Round 2</option>
                    <option value="Interview3">Interview Round 3</option>
                    <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="form-control mt-1 w-full">
                    <label className="label">
                    <span className="p-1 label-text">Apply Date</span>
                    </label>
                    <input
                    type="date"
                    className="input w-full"
                    value={applyDate}
                    onChange={(e) => setApplyDate(e.target.value)}
                    />
                </div>
                </div>

                <div className="form-control mt-1">
                <label className="label">
                    <span className="p-1 label-text">City</span>
                </label>
                <input
                    type="text"
                    className="input w-full"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                </div>

                <div className="form-control mt-1">
                <label className="label">
                    <span className="p-1 label-text">Link</span>
                </label>
                <input
                    type="text"
                    className="input w-full"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                </div>

                <div className="flex justify-center mt-6">
                <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={() => setIsOpen(false)}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={`btn btn-primary`}
                >
                    Save
                </button>
                </div>
            </form>
            </div>
        </div>
        )}
    </div>
    )
}

export default AddCompany