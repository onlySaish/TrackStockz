const DashboardCard = ({ title, value }: { title: string, value: (number | string | undefined) }) => {
    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg rounded-md text-center border border-gray-900 hover:shadow-xl transition">
            <h2 className="text-lg font-medium text-white">{title}</h2>
            <p className="text-3xl font-bold text-white mt-2">
                {value !== undefined && value !== null && !(typeof value === 'number' && isNaN(value)) ? value.toString() : "-"}
            </p>
        </div>
    );
};

export default DashboardCard;