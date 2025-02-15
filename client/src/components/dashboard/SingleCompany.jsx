import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { deleteCompany } from '../../redux/companyReducer';
import { useDeleteCompanyMutation } from '../../redux/companyApiSlice';
import { FaXmark } from "react-icons/fa6";
import EditCompany from './EditCompany';
const SingleCompany = ({ company }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [deleteCompany, {isLoading}] = useDeleteCompanyMutation();

    // MARK: Label Color Settings
    const isSubmitted = company.status === 'Submitted';
    const isRejected = company.status === 'Rejected';
    const isInProgress = company.status !== 'Submitted' && company.status !== 'Rejected';
    const statusColor = isSubmitted ? 'bg-green-50 text-green-700' : isRejected ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700';

    const handleDelete = async() => {
        const confirm = window.confirm('Are you sure you want to delete this company? This action cannot be undone.');
        if (!confirm) return;
        try {
            await deleteCompany(company.id).unwrap();
            toast.success("Company deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete company');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toISOString().split('T')[0];
    }

    return (
        <>
        <div className='flex flex-col h-48 company-card rounded-lg p-3'>
            <div className="glass-background h-48"></div>
            <button 
            className='btn btn-sm btn-ghost absolute top-2 right-2 justify-end text-gray-500'
            onClick={handleDelete}
            >
                <FaXmark />
            </button>
            <div className="flex w-full items-center justify-between space-x-6 p-4">
                <img
                    alt={`${company.name} logo`}
                    src={company.imgUrl}
                    className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                />
                <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                    <h3 className="prime-text truncate text-sm font-medium">{company.name}</h3>
                    <span className={`inline-flex flex-shrink-0 items-center rounded-full ${statusColor} px-1.5 py-0.5 text-xs font-medium  ring-1 ring-inset ring-green-600/20`}>
                        {company.status}
                    </span>
                    </div>
                    <p className="prime-text mt-1 truncate text-sm">{company.role}</p>
                </div>
                <EditCompany company={company} />

            </div>
            <div className="flex flex-1 flex-col mx-3">
                <dl className="mx-2 flex flex-grow flex-col">
                    <div className='flex flex-row justify-between'> 
                        <dt className='sec-text text-sm'>Apply Date</dt>
                        <dd className="text-sm prime-text">{company.applyDate}</dd>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <dt className='sec-text text-sm'>Location</dt>
                        <dd className="text-sm prime-text">{company.city}</dd>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <dt className='sec-text text-sm'>Link</dt>
                        <dd className="text-sm prime-text hover:text-gray-400">
                            <a href={company.link}>Click to redirect</a>
                        </dd>
                    </div>
                    <div className='flex flex-row justify-between'>
                            <dt className='sec-text text-sm'>Updated At:</dt>
                            <dd className="text-sm  prime-text">{formatDate(company.updatedAt)}</dd>
                        </div>
                </dl>
            </div>
        </div>
        </>

    );
};

export default SingleCompany;
