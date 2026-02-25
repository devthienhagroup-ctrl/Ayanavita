import type { CategoriesTabProps } from './types'

export function CategoriesTab({ categories, categoryForm, editingCategory, onCategoryFormChange, onSaveCategory, onEditCategory, onDeleteCategory, onCancelEdit }: CategoriesTabProps) {
  return (
    <div className='admin-grid'>
      <section className='admin-card admin-card-glow'>
        <h3 className='admin-card-title'><i className='fa-solid fa-layer-group' /> {editingCategory ? 'Cập nhật danh mục dịch vụ' : 'Tạo danh mục dịch vụ'}</h3>
        <div className='admin-form-grid'>
          <label className='admin-field'><span className='admin-label'>Mã danh mục</span><input className='admin-input' placeholder='VD: SKINCARE' value={categoryForm.code} onChange={(e) => onCategoryFormChange({ ...categoryForm, code: e.target.value.toUpperCase() })} /></label>
          <label className='admin-field'><span className='admin-label'>Tên danh mục</span><input className='admin-input' placeholder='VD: Chăm sóc da' value={categoryForm.name} onChange={(e) => onCategoryFormChange({ ...categoryForm, name: e.target.value })} /></label>
          <label className='admin-field'>
            <span className='admin-label'>Trạng thái</span>
            <select className='admin-input' value={String(categoryForm.isActive)} onChange={(e) => onCategoryFormChange({ ...categoryForm, isActive: e.target.value === 'true' })}>
              <option value='true'>Đang hoạt động</option>
              <option value='false'>Ngưng hoạt động</option>
            </select>
          </label>
        </div>
        <div className='admin-row'>
          <button className='admin-btn admin-btn-primary' onClick={onSaveCategory}>{editingCategory ? 'Lưu thay đổi' : 'Thêm danh mục'}</button>
          {editingCategory && <button className='admin-btn admin-btn-ghost' onClick={onCancelEdit}>Hủy</button>}
        </div>
      </section>

      <section className='admin-card'>
        <h3 className='admin-card-title'><i className='fa-solid fa-table-list' /> Danh sách danh mục</h3>
        <div className='admin-table-wrap'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Mã</th>
                <th>Trạng thái</th>
                <th>Số dịch vụ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className='td-strong'>{category.name}</td>
                  <td><span className='admin-badge admin-badge-purple'>{category.code}</span></td>
                  <td>{category.isActive ? 'Hoạt động' : 'Không hoạt động'}</td>
                  <td>{category.serviceCount}</td>
                  <td>
                    <div className='admin-row'>
                      <button className='admin-btn admin-btn-ghost' onClick={() => onEditCategory(category)}>Sửa</button>
                      <button className='admin-btn admin-btn-danger' onClick={() => onDeleteCategory(category)} disabled={category.serviceCount > 0}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
