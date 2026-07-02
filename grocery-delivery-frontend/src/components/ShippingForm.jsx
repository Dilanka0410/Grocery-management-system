import React from 'react';

const ShippingForm = ({ shippingAddress, setShippingAddress }) => {
    const updateField = (field) => (e) => {
        setShippingAddress(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            <input value={shippingAddress.fullName} onChange={updateField('fullName')} placeholder="Full Name" className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500" />
            <input value={shippingAddress.phone} onChange={updateField('phone')} placeholder="Phone Number" className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500" />
            <input value={shippingAddress.houseNo} onChange={updateField('houseNo')} placeholder="House / Flat Number" className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500" />
            <input value={shippingAddress.street} onChange={updateField('street')} placeholder="Street / Road" className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500" />
            <input value={shippingAddress.city} onChange={updateField('city')} placeholder="City" className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500" />
            <input value={shippingAddress.district} onChange={updateField('district')} placeholder="District" className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500" />
            <input value={shippingAddress.province} onChange={updateField('province')} placeholder="Province" className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500" />
            <input value={shippingAddress.landmark} onChange={updateField('landmark')} placeholder="Landmark (optional)" className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500" />
            <select value={shippingAddress.addressLabel} onChange={updateField('addressLabel')} className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500">
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
            </select>
        </div>
    );
};

export default ShippingForm;
