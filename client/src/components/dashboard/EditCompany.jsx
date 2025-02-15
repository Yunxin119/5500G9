import React, { useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { updateCompany } from '../../redux/companyReducer'
import { useUpdateCompanyMutation } from '../../redux/companyApiSlice'
import { toast } from 'react-toastify'
const EditCompany = ({company}) => {
    // MARK: State
    const [isOpen, setIsOpen ] = useState(false)
    const [name, setName] = useState(company.name || '');
    const [role, setRole] = useState(company.role || '');
    const [status, setStatus] = useState(company.status || '');
    const [city, setCity] = useState(company.city || '');
    const [link, setLink] = useState(company.link || '');
    const formattedDate = company.applyDate
    ? new Date(company.applyDate).toISOString().split('T')[0]
    : '';
    const [applyDate, setApplyDate] = useState(formattedDate);

    // MARK: Api
    const [updateCompany, {isLoading}] = useUpdateCompanyMutation();
    const handleEdit = async(e) => {
        e.preventDefault();
        if (!name || !role || !status || !city || !link || !applyDate) {
            toast.error('Please fill out all fields');
            return;
        }
        try {
            const updatedCompany = {
                id: company.id,
                name,
                role,
                status,
                city,
                link,
                applyDate: formattedDate,
                updatedAt: new Date().toISOString(),
            };
            await updateCompany(updatedCompany).unwrap();
            toast.success('Company updated successfully!');
            setIsOpen(false);
        } catch (error) {
            console.error(error);
        }

    }
  return (
    <div>
      {/* Edit Button */}
      <button
        className="btn"
        onClick={() => setIsOpen(true)}
      >
        <MdEdit />
      </button>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="edit">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">Edit Company</h2>
            <form onSubmit={handleEdit} className='flex flex-col p-2'>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
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
                  <span className="label-text">Role</span>
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
                    <span className="label-text">Status</span>
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
                    <span className="label-text">Apply Date</span>
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
                  <span className="label-text">City</span>
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
                  <span className="label-text">Link</span>
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

export default EditCompany
