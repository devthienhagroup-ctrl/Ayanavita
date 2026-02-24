import type { SpecialistsTabProps } from './types'

export function SpecialistsTab({ branches, services, specialists, specialistForm, relationForm, editingSpecialist, onSpecialistFormChange, onRelationFormChange, onSaveSpecialist, onEditSpecialist, onDeleteSpecialist, onShowSpecialistDetail, onSaveRelation, onCancelEdit }: SpecialistsTabProps) {
  return (
    <div className='admin-grid'>
      <section className='admin-card admin-card-glow'>
        <h3 className='admin-card-title'><i className='fa-solid fa-user-nurse' /> {editingSpecialist ? 'Cập nhật chuyên viên' : 'Thêm chuyên viên'}</h3>
        <div className='admin-form-grid'>
          <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-id-card' /> Code</span><input className='admin-input' placeholder='SPEC_001' value={specialistForm.code} onChange={(e) => onSpecialistFormChange({ ...specialistForm, code: e.target.value })} /></label>
          <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-user' /> Tên chuyên viên</span><input className='admin-input' placeholder='Tên chuyên viên' value={specialistForm.name} onChange={(e) => onSpecialistFormChange({ ...specialistForm, name: e.target.value })} /></label>
          <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-medal' /> Cấp độ</span><select className='admin-input' value={specialistForm.level} onChange={(e) => onSpecialistFormChange({ ...specialistForm, level: e.target.value })}><option value='THERAPIST'>THERAPIST</option><option value='SENIOR'>SENIOR</option><option value='EXPERT'>EXPERT</option></select></label>
          <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-address-card' /> Bio</span><textarea className='admin-input' placeholder='Mô tả năng lực chuyên viên' value={specialistForm.bio} onChange={(e) => onSpecialistFormChange({ ...specialistForm, bio: e.target.value })} /></label>
        </div>
        <div className='admin-row'>
          <button className='admin-btn admin-btn-primary' onClick={onSaveSpecialist}>{editingSpecialist ? 'Lưu thay đổi' : 'Thêm chuyên viên'}</button>
          {editingSpecialist && <button className='admin-btn admin-btn-ghost' onClick={onCancelEdit}>Hủy</button>}
        </div>

        <hr className='admin-divider' />
        <h4 className='admin-subtitle'><i className='fa-solid fa-link' /> Gán quan hệ N-N</h4>
        <div className='admin-form-grid'>
          <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-building' /> Chi nhánh</span><select className='admin-input' value={relationForm.branchId} onChange={(e) => onRelationFormChange({ ...relationForm, branchId: Number(e.target.value) })}><option value={0}>Chọn chi nhánh</option>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
          <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-spa' /> Dịch vụ</span><select className='admin-input' value={relationForm.serviceId} onChange={(e) => onRelationFormChange({ ...relationForm, serviceId: Number(e.target.value) })}><option value={0}>Chọn dịch vụ</option>{services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
          <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-user-nurse' /> Chuyên viên</span><select className='admin-input' value={relationForm.specialistId} onChange={(e) => onRelationFormChange({ ...relationForm, specialistId: Number(e.target.value) })}><option value={0}>Chọn chuyên viên</option>{specialists.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        </div>
        <button className='admin-btn admin-btn-ghost' onClick={onSaveRelation}><i className='fa-solid fa-floppy-disk' />Lưu quan hệ</button>
      </section>

      <section className='admin-card'>
        <h3 className='admin-card-title'><i className='fa-solid fa-table-list' /> Danh sách chuyên viên</h3>
        <div className='admin-table-wrap'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Cấp độ</th>
                <th>Chi nhánh</th>
                <th>Dịch vụ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {specialists.map((item) => (
                <tr key={item.id}>
                  <td className='td-strong'>{item.name}</td>
                  <td><span className={`admin-badge ${item.level === 'EXPERT' ? 'admin-badge-purple' : item.level === 'SENIOR' ? 'admin-badge-blue' : 'admin-badge-pastel'}`}>{item.level}</span></td>
                  <td>{item.branchIds.join(', ') || '-'}</td>
                  <td>{item.serviceIds.join(', ') || '-'}</td>
                  <td>
                    <div className='admin-row'>
                      <button className='admin-btn admin-btn-ghost' onClick={() => onEditSpecialist(item)}>Sửa</button>
                      <button className='admin-btn admin-btn-ghost' onClick={() => onShowSpecialistDetail(item)}>Chi tiết</button>
                      <button className='admin-btn admin-btn-danger' onClick={() => onDeleteSpecialist(item)}>Xóa</button>
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
