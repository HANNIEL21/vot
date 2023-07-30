import { useEffect, useState } from 'react';

const ParticipantScreen = ({ participantes }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;

            if (screenWidth > 1200) {
                setItemsPerPage(30);
            } else if (screenWidth > 800) {
                setItemsPerPage(11);
            } else if (screenWidth > 600) {
                setItemsPerPage(9);
            } else {
                setItemsPerPage(6);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate total number of pages
    const totalPages = Math.ceil(participantes.length / itemsPerPage);

    // Make sure the current page is within bounds
    const normalizedCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

    const lastIndex = normalizedCurrentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const user = participantes.slice(firstIndex, lastIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate pagination buttons
    const paginationButtons = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationButtons.push(
            <button
                key={i}
                className={normalizedCurrentPage === i ? "active btn btn-outline-light mb-1" : "btn btn-outline-light mb-1"}
                onClick={() => handlePageChange(i)}
            >
                {i}
            </button>
        );
    }

    return (
        <div className="min-vh-100 p-4 d-flex align-items-center justify-content-between ">
            <div className="container-fluid p-4">
                <div className="row g-4">
                    <div className="col-11">
                        <div className="item-container">
                            {user.length === 0 ? (
                                <div>No participants found.</div>
                            ) : (
                                user.map((item) => (
                                    <div
                                        key={item.uid}
                                        className={'item rounded-3 shadow-sm bg-light p-4'}
                                    >
                                        <div
                                            className="container bg-white rounded-3 d-flex align-items-center justify-content-center mb-4"
                                            style={{ height: '50px', width: '50px' }}
                                        >
                                            <h2 className="text-capitalize m-0">
                                                {item.name.charAt(0)}
                                            </h2>
                                        </div>
                                        <blockquote className="text-dark text-center fw-bold text-capitalize m-0">
                                            {item.name}
                                        </blockquote>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="col-1 d-flex align-items-center justify-content-center">
                        <ul className="pagination d-flex flex-column align-items-center">
                            {paginationButtons}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantScreen;



