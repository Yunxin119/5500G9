import React, { useState } from 'react';
import SingleCompany from './SingleCompany';
import { useSelector } from 'react-redux';
import { useGetCompanyQuery } from '../../redux/companyApiSlice';
import Filter from './Filter';
import FunctionButtons from './FunctionButtons';

const CompanyGrid = () => {
    const { userInfo } = useSelector((state) => state.authReducer);
    const { data: companies } = useGetCompanyQuery();
    const [isReverse, setIsReverse] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchInput, setSearchInput] = useState('');
    const validCompanies = Array.isArray(companies) ? companies : [];
    // Valid companies after filters and sorting
    const filteredCompanies = validCompanies
        .slice()
        .sort((a, b) => {
            if (a.status === 'Rejected' && b.status !== 'Rejected') return 1;
            if (a.status !== 'Rejected' && b.status === 'Rejected') return -1;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        })
        .filter(company => {
            if (statusFilter === 'All') return company.status !== 'Rejected';
            return company.status === statusFilter;
        })
        .filter(company => company.name.toLowerCase().includes(searchInput.toLowerCase()));

    const displayedCompanies = isReverse ? [...filteredCompanies].reverse() : filteredCompanies;

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-row justify-between items-center">
                {/* Filter Box */}
                <Filter 
                    statusFilter={statusFilter} 
                    setStatusFilter={setStatusFilter} 
                    filteredCompanies={filteredCompanies}
                />
                {/* Functional Buttons */}
                <FunctionButtons
                    isReverse={isReverse}
                    setIsReverse={setIsReverse}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    setStatusFilter={setStatusFilter}
                />
            </div>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-1 items-center">
                {displayedCompanies.length > 0 ? (
                    displayedCompanies.map(company => (
                        <SingleCompany key={company.id} company={company} />
                    ))
                ) : (
                    <div className="text-center text-gray-700 text-2xl">No companies found</div>
                )}
            </div>
        </div>
    );
};

export default CompanyGrid;
