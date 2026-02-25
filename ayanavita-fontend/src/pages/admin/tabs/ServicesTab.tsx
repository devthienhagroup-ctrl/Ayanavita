import { useEffect, useMemo, useState } from 'react'
import { spaAdminApi, type Branch, type SpaService, type Specialist } from '../../../api/spaAdmin.api'
import type { ServicesTabProps } from './types'

const renderJsonPreview = (items: string[], badgeClass: string, extraBadgeClass: string) => {
  if (!items?.length) return '-'
  const [first, ...rest] = items
  return (
    <div className='admin-row admin-row-nowrap'>
      <span className={`admin-badge admin-badge-ellipsis ${badgeClass}`} title={first}>{first}</span>
      {rest.length > 0 && <span className={`admin-badge ${extraBadgeClass}`}>+{rest.length}</span>}
    </div>
  )
}

const pageSizeOptions = [5, 10, 20, 50]

const renderDetailLines = (items: string[]) => {
  if (!items.length) return <p className='service-detail-empty'>Không có dữ liệu</p>
  return (
    <ul className='service-detail-lines'>
      {items.map((item, index) => (
        <li key={`${index}-${item}`}>
          <i className='fa-solid fa-circle-dot service-detail-line-icon' />
          <span>{index + 1}. {item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ServicesTab({
  services,
  categories,
  serviceForm,
  editingService,
  selectedImageName,
  searchKeyword,
  pagination,
  onSearchKeywordChange,
  onPageChange,
  onPageSizeChange,
  onServiceFormChange,
  onSelectImage,
  onSaveService,
  onEditService,
  onDeleteService,
  onCancelEdit,
}: ServicesTabProps) {
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [detailService, setDetailService] = useState<SpaService | null>(null)
  const [detailSpecialists, setDetailSpecialists] = useState<Specialist[]>([])
  const [detailBranches, setDetailBranches] = useState<Branch[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  const handleOpenCreate = () => {
    onCancelEdit()
    setEditModalOpen(true)
  }

  const handleOpenEdit = (service: SpaService) => {
    onEditService(service)
    setEditModalOpen(true)
  }

  const handleCloseEdit = () => {
    onCancelEdit()
    setEditModalOpen(false)
  }

  const pageInfoLabel = useMemo(() => {
    if (!pagination.total) return 'Không có dữ liệu'
    const start = (pagination.page - 1) * pagination.pageSize + 1
    const end = Math.min(pagination.page * pagination.pageSize, pagination.total)
    return `${start}-${end} / ${pagination.total}`
  }, [pagination.page, pagination.pageSize, pagination.total])

  useEffect(() => {
    if (!detailService) {
      setDetailSpecialists([])
      setDetailBranches([])
      setDetailError('')
      return
    }

    let active = true
    setDetailLoading(true)
    setDetailError('')

    Promise.all([
      spaAdminApi.specialists({ serviceId: detailService.id }),
      spaAdminApi.branches({ includeInactive: true, serviceId: detailService.id }),
    ])
      .then(([specialists, branches]) => {
        if (!active) return
        setDetailSpecialists(specialists)
        setDetailBranches(branches)
      })
      .catch(() => {
        if (!active) return
        setDetailError('Không thể tải thêm dữ liệu chi tiết. Vui lòng thử lại.')
        setDetailSpecialists([])
        setDetailBranches([])
      })
      .finally(() => {
        if (active) setDetailLoading(false)
      })

    return () => {
      active = false
    }
  }, [detailService])

  return (
    <section className='admin-card admin-card-full'>
      <div className='admin-row admin-row-space'>
        <h3 className='admin-card-title'><i className='fa-solid fa-table-list' /> Quản lý dịch vụ</h3>
        <button className='admin-btn admin-btn-primary' onClick={handleOpenCreate}><i className='fa-solid fa-plus' /> Thêm dịch vụ</button>
      </div>

      <div className='admin-row services-toolbar'>
        <label className='admin-field services-search-field'>
          <span className='admin-label'><i className='fa-solid fa-magnifying-glass' /> Tìm tên dịch vụ</span>
          <input
            className='admin-input'
            placeholder='Nhập tên dịch vụ...'
            value={searchKeyword}
            onChange={(e) => onSearchKeywordChange(e.target.value)}
          />
        </label>
        <label className='admin-field services-size-field'>
          <span className='admin-label'><i className='fa-solid fa-list-ol' /> Size trang</span>
          <select className='admin-input' value={pagination.pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>{size} / trang</option>
            ))}
          </select>
        </label>
      </div>

      <div className='admin-table-wrap'>
        <table className='admin-table services-table'>
          <thead>
            <tr>
              <th>Tên dịch vụ</th>
              <th>Danh mục</th>
              <th>Thời lượng</th>
              <th>Giá</th>
              <th>Rating</th>
              <th>Lượt đặt</th>
              <th>Mục tiêu </th>
              <th>Phù hợp </th>
              <th>Quy trình </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td className='td-strong services-name-cell' title={service.name}>{service.name}</td>
                <td className='services-category-cell' title={service.category || '-'}>{service.category || '-'}</td>
                <td>{service.durationMin} phút</td>
                <td><span className='admin-badge admin-badge-blue'>{service.price.toLocaleString('vi-VN')}đ</span></td>
                <td>
                  <span className='services-rating'>
                    <i className='fa-solid fa-star services-rating-icon' /> {service.ratingAvg.toFixed(1)}
                  </span>
                </td>
                <td><span className='services-booked'>{service.bookedCount ?? 0}</span></td>
                <td>{renderJsonPreview(service.goals || [], 'admin-badge-pink', 'admin-badge-rose')}</td>
                <td>{renderJsonPreview(service.suitableFor || [], 'admin-badge-cyan', 'admin-badge-sky')}</td>
                <td>{renderJsonPreview(service.process || [], 'admin-badge-amber', 'admin-badge-yellow')}</td>
                <td>
                  <div className='service-action-menu'>
                    <button className='admin-btn admin-btn-ghost service-action-trigger' aria-label='Mở thao tác'>
                      <i className='fa-solid fa-ellipsis' />
                    </button>
                    <div className='service-action-list'>
                      <button className='service-action-item' onClick={() => setDetailService(service)} title='Chi tiết'>
                        <span className='admin-btn-icon admin-btn-icon-info'>
                          <i className='fa-solid fa-circle-info' />
                        </span>
                        <span className='service-action-text'>Chi tiết</span>
                      </button>
                      <button className='service-action-item' onClick={() => handleOpenEdit(service)} title='Sửa'>
                        <span className='admin-btn-icon admin-btn-icon-edit'>
                          <i className='fa-solid fa-pen-to-square' />
                        </span>
                        <span className='service-action-text'>Sửa</span>
                      </button>
                      <button className='service-action-item' onClick={() => onDeleteService(service)} title='Xóa'>
                        <span className='admin-btn-icon admin-btn-icon-delete'>
                          <i className='fa-solid fa-trash' />
                        </span>
                        <span className='service-action-text'>Xóa</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={10} className='services-empty-state'>Không có dịch vụ phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='admin-row admin-row-space services-pagination'>
        <span className='admin-helper'>Hiển thị: {pageInfoLabel}</span>
        <div className='admin-row services-pagination-controls'>
          <button className='admin-btn admin-btn-ghost' disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}>
            <i className='fa-solid fa-chevron-left' /> Trước
          </button>
          <span className='admin-helper'>Trang {pagination.page}/{Math.max(1, pagination.totalPages)}</span>
          <button
            className='admin-btn admin-btn-ghost'
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Sau <i className='fa-solid fa-chevron-right' />
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <div className='admin-modal-overlay' onClick={handleCloseEdit}>
          <div className='admin-modal' onClick={(e) => e.stopPropagation()}>
            <div className='admin-row admin-row-space'>
              <h3 className='admin-card-title'><i className='fa-solid fa-spa' /> {editingService ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ mới'}</h3>
              <button className='admin-btn admin-btn-ghost' onClick={handleCloseEdit}><i className='fa-solid fa-xmark' /> Đóng</button>
            </div>
            <div className='admin-form-grid'>
              <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-sparkles' /> Tên dịch vụ</span><input className='admin-input' value={serviceForm.name} onChange={(e) => onServiceFormChange({ ...serviceForm, name: e.target.value })} /></label>
              <label className='admin-field'>
                <span className='admin-label'><i className='fa-solid fa-layer-group' /> Danh mục</span>
                <select className='admin-input' value={serviceForm.categoryId || 0} onChange={(e) => onServiceFormChange({ ...serviceForm, categoryId: Number(e.target.value) })}>
                  <option value={0}>Chọn danh mục</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-bullseye' /> Mục tiêu </span><input className='admin-input' placeholder='Relax, Detox' value={serviceForm.goals} onChange={(e) => onServiceFormChange({ ...serviceForm, goals: e.target.value })} /></label>
              <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-users' /> Những ai phù hợp </span><input className='admin-input' placeholder='Người stress, Mất ngủ' value={serviceForm.suitableFor} onChange={(e) => onServiceFormChange({ ...serviceForm, suitableFor: e.target.value })} /></label>
              <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-list-check' /> Quy trình </span><input className='admin-input' placeholder='B1 chào hỏi, B2 tư vấn, B3 trị liệu' value={serviceForm.process} onChange={(e) => onServiceFormChange({ ...serviceForm, process: e.target.value })} /></label>
              <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-clock' /> Thời lượng (phút)</span><input className='admin-input' type='number' value={serviceForm.durationMin} onChange={(e) => onServiceFormChange({ ...serviceForm, durationMin: Number(e.target.value) })} /></label>
              <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-coins' /> Giá</span><input className='admin-input' type='number' value={serviceForm.price} onChange={(e) => onServiceFormChange({ ...serviceForm, price: Number(e.target.value) })} /></label>
              <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-tag' /> Tag</span><input className='admin-input' value={serviceForm.tag} onChange={(e) => onServiceFormChange({ ...serviceForm, tag: e.target.value })} /></label>
              <label className='admin-field'><span className='admin-label'><i className='fa-solid fa-star' /> Rating trung bình</span><input className='admin-input' value={editingService?.ratingAvg?.toFixed(1) || '5.0'} disabled /></label>
              <label className='admin-field admin-field-full'><span className='admin-label'><i className='fa-solid fa-pen-to-square' /> Mô tả</span><textarea className='admin-input' value={serviceForm.description} onChange={(e) => onServiceFormChange({ ...serviceForm, description: e.target.value })} /></label>
              <label className='admin-field admin-field-full'><span className='admin-label'><i className='fa-solid fa-cloud-arrow-up' /> Upload ảnh</span><input type='file' accept='image/*' onChange={(e) => onSelectImage(e.target.files?.[0] || null)} /></label>
              {selectedImageName && <span className='admin-helper'>Đã chọn: {selectedImageName}</span>}
            </div>
            <div className='admin-row'>
              <button className='admin-btn admin-btn-primary' onClick={async () => { await onSaveService(); setEditModalOpen(false) }}>{editingService ? 'Lưu thay đổi' : 'Thêm dịch vụ'}</button>
              <button className='admin-btn admin-btn-ghost' onClick={handleCloseEdit}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {detailService && (
        <div className='admin-modal-overlay' onClick={() => setDetailService(null)}>
          <div className='admin-modal service-detail-modal' onClick={(e) => e.stopPropagation()}>
            <div className='service-detail-header'>
              <div>
                <p className='service-detail-eyebrow'>SERVICE PROFILE</p>
                <h3 className='admin-card-title'><i className='fa-solid fa-circle-info' /> {detailService.name}</h3>
              </div>
              <button className='admin-btn admin-btn-ghost' onClick={() => setDetailService(null)}><i className='fa-solid fa-xmark' /> Đóng</button>
            </div>

            {detailLoading && <p className='admin-helper'>Đang tải chuyên viên và chi nhánh liên quan...</p>}
            {detailError && <p className='service-detail-error'>{detailError}</p>}

            <div className='service-detail-layout'>
              <section className='service-detail-image-panel'>
                {detailService.imageUrl
                  ? <img className='service-detail-image' src={detailService.imageUrl} alt={`Dịch vụ ${detailService.name}`} />
                  : <div className='service-detail-image-empty'>Chưa có hình ảnh dịch vụ</div>}
                <div className='service-detail-metrics'>
                  <span className='admin-badge admin-badge-blue'>Giá: {detailService.price.toLocaleString('vi-VN')}đ</span>
                  <span className='admin-badge admin-badge-yellow'>Thời lượng: {detailService.durationMin} phút</span>
                  <span className='admin-badge admin-badge-pink'>Rating: {detailService.ratingAvg.toFixed(1)}</span>
                  <span className='admin-badge admin-badge-green'>Lượt đặt: {detailService.bookedCount ?? 0}</span>
                </div>
              </section>

              <section className='service-detail-content'>
                <div className='service-detail-grid'>
                  <article className='service-detail-card'>
                    <h4><i className='fa-solid fa-clipboard-list' /> Thông tin nhanh</h4>
                    <p><b>ID:</b> {detailService.id}</p>
                    <p><b>Danh mục:</b> {detailService.category || '-'}</p>
                    <p><b>Tag:</b> {detailService.tag || '-'}</p>
                    <p><b>Mô tả:</b> {detailService.description || '-'}</p>
                  </article>

                  <article className='service-detail-card'>
                    <h4><i className='fa-solid fa-file-lines' /> Nội dung dịch vụ</h4>
                    <p><b>Mục tiêu:</b></p>
                    {renderDetailLines(detailService.goals || [])}
                    <p><b>Phù hợp:</b></p>
                    {renderDetailLines(detailService.suitableFor || [])}
                    <p><b>Quy trình:</b></p>
                    {renderDetailLines(detailService.process || [])}
                  </article>

                  <article className='service-detail-card service-branch-specialists-card'>
                    <h4><i className='fa-solid fa-building-circle-check' /> Chi nhánh & chuyên viên theo dịch vụ</h4>
                    {detailBranches.length > 0
                      ? (
                        <ul className='service-branch-list'>
                          {detailBranches.map((branch) => {
                            const specialistsByBranch = detailSpecialists.filter((specialist) => specialist.branchId === branch.id)
                            return (
                              <li key={branch.id} className='service-branch-item'>
                                <div className='service-branch-line'>
                                  <i className='fa-solid fa-building service-branch-icon' />
                                  <span><b>{branch.name}</b> • {branch.address}</span>
                                </div>
                                <ul className='service-specialist-sublist'>
                                  {specialistsByBranch.length > 0
                                    ? specialistsByBranch.map((specialist) => (
                                      <li key={specialist.id} className='service-specialist-subitem'>
                                        <i className='fa-solid fa-user-doctor service-specialist-icon' />
                                        <span>{specialist.name} ({specialist.level})</span>
                                      </li>
                                    ))
                                    : <li className='service-specialist-subitem service-detail-empty-item'><i className='fa-regular fa-circle-xmark service-specialist-icon' /><span>Chưa có chuyên viên cho dịch vụ này tại chi nhánh.</span></li>}
                                </ul>
                              </li>
                            )
                          })}
                        </ul>
                      )
                      : <p className='service-detail-empty'>Chưa có chi nhánh liên kết.</p>}
                  </article>

                  <article className='service-detail-card'>
                    <h4><i className='fa-solid fa-user-doctor' /> Tổng chuyên viên phụ trách ({detailSpecialists.length})</h4>
                    {detailSpecialists.length > 0
                      ? (
                        <ul className='service-detail-lines'>
                          {detailSpecialists.map((specialist) => (
                            <li key={specialist.id}>
                              <i className='fa-solid fa-stethoscope service-detail-line-icon' />
                              <span>{specialist.name} ({specialist.level})</span>
                            </li>
                          ))}
                        </ul>
                      )
                      : <p className='service-detail-empty'>Chưa có chuyên viên liên kết.</p>}
                  </article>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
