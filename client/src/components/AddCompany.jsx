import React, {useState, useEffect} from 'react'
import { addCompany } from '../redux/companyReducer';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa6';
import { useAddCompanyMutation } from '../redux/companyApiSlice';

const AddCompany = ({ isOpen: externalIsOpen = false, onClose = () => {}, initialData = {}, hideButton = false }) => {
    // MARK: State
    const [isOpen, setIsOpen] = useState(externalIsOpen);
    const [name, setName] = useState(initialData.name || '');
    const [role, setRole] = useState(initialData.role || '');
    const [status, setStatus] = useState(initialData.status || 'Submitted');
    const [city, setCity] = useState(initialData.city || '');
    const [link, setLink] = useState(initialData.link || '');
    const [applyDate, setApplyDate] = useState('');
    const [addCompany, {isLoading}] = useAddCompanyMutation();
    
    // Update state when initialData or externalIsOpen changes
    useEffect(() => {
        if (externalIsOpen) {
            setIsOpen(true);
            setName(initialData.name || '');
            setRole(initialData.role || '');
            setStatus(initialData.status || 'Submitted');
            setCity(initialData.city || '');
            setLink(initialData.link || '');
            
            // Handle date format conversion for the date input field
            if (initialData.applyDate) {
                // Check if date is in MM/DD/YYYY format
                const dateMatch = initialData.applyDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                if (dateMatch) {
                    // Convert to YYYY-MM-DD for date input
                    const [_, month, day, year] = dateMatch;
                    setApplyDate(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                } else {
                    setApplyDate(initialData.applyDate);
                }
            } else {
                setApplyDate('');
            }
        }
    }, [externalIsOpen, initialData]);

    // Get formatted date for API
    const getFormattedDate = () => {
        if (!applyDate) return '';
        
        const dateObj = new Date(applyDate);
        return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    };

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
                applyDate: getFormattedDate(),
                updatedAt: new Date().toISOString(),
                user: userInfo._id,
            };
    
            const res = await addCompany(newCompany).unwrap();
            handleClose();
            toast.success('Application added successfully!');
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.msg || 'Failed to add application');
        }
    };
    
    // Handle modal close
    const handleClose = () => {
        setIsOpen(false);
        if (externalIsOpen) {
            onClose();
        }
    };

    return (
        <>
            {/* Add Button - Only show if not controlled externally */}
            {!externalIsOpen && !hideButton && (
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
            )}
            
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="edit">
                        <h2 className="text-2xl font-bold mb-4">New Application</h2>
                        <form onSubmit={handleAdd} className='flex flex-col p-2'>
                            <div className="form-control">
                                <label className="label">
                                    <span className="p-1 label-text">Company Name*</span>
                                </label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-control mt-1">
                                <label className="label">
                                    <span className="p-1 label-text">Role*</span>
                                </label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='flex flex-row justify-between gap-2'>
                                <div className="form-control mt-1 w-full">
                                    <label className="label">
                                        <span className="p-1 label-text">Status*</span>
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
                                        <span className="p-1 label-text">Apply Date*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="input w-full"
                                        value={applyDate}
                                        onChange={(e) => setApplyDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control mt-1">
                                <label className="label">
                                    <span className="p-1 label-text">City/Location*</span>
                                </label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-control mt-1">
                                <label className="label">
                                    <span className="p-1 label-text">Job URL*</span>
                                </label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    type="button"
                                    className="btn btn-secondary mr-2"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddCompany