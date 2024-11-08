import { Pagination } from 'antd'

import './footer.scss'

function Footer({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <Pagination
        current={currentPage}
        pageSize={1}
        total={totalPages}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </div>
  )
}
export default Footer
