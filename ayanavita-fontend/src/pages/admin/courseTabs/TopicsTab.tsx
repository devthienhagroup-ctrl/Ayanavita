import type { CourseAdmin, CourseTopic } from '../../../api/adminCourses.api'

type Props = {
  topics: CourseTopic[]
  coursesByTopic: Record<number, number>
  name: string
  description: string
  editingId: number | null
  setName: (value: string) => void
  setDescription: (value: string) => void
  onSave: () => void
  onReset: () => void
  onEdit: (topic: CourseTopic) => void
  onDelete: (topic: CourseTopic) => void
}

export function TopicsTab({
  topics,
  coursesByTopic,
  name,
  description,
  editingId,
  setName,
  setDescription,
  onSave,
  onReset,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className='admin-grid admin-courses-grid'>
      <article className='admin-card admin-card-glow admin-topic-form-card'>
        <h3 className='admin-card-title'><i className='fa-solid fa-pen-ruler' /> Form chủ đề khóa học</h3>
        <div className='admin-form-grid'>
          <label className='admin-field'>
            <span className='admin-label'>Tên chủ đề</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder='Nhập tên chủ đề' className='admin-input' />
          </label>

          <label className='admin-field'>
            <span className='admin-label'>Mô tả ngắn</span>
            <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder='Mô tả tuỳ chọn' className='admin-input' />
          </label>

          <div className='admin-row'>
            <button onClick={onSave} className='admin-btn admin-btn-save'>
              <i className='fa-solid fa-floppy-disk' /> {editingId ? 'Cập nhật chủ đề' : 'Tạo chủ đề'}
            </button>
            {editingId && (
              <button onClick={onReset} className='admin-btn admin-btn-ghost'>
                <i className='fa-solid fa-rotate-left' /> Huỷ chỉnh sửa
              </button>
            )}
          </div>
        </div>

        <div className='admin-topic-form-watermark' aria-hidden='true'>
          <span>A</span>
        </div>
      </article>

      <article className='admin-card admin-card-glow'>
        <h3 className='admin-card-title'><i className='fa-solid fa-table-list' /> Danh sách chủ đề ({topics.length})</h3>
        <div className='admin-table-wrap'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên chủ đề</th>
                <th>Mô tả</th>
                <th>Số khoá học</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => {
                const total = coursesByTopic[topic.id] || topic._count?.courses || 0
                return (
                  <tr key={topic.id}>
                    <td>{topic.id}</td>
                    <td className='td-strong'>{topic.name}</td>
                    <td>{topic.description || '-'}</td>
                    <td>{total}</td>
                    <td>
                      <div className='admin-row'>
                        <button className='admin-btn-icon admin-btn-icon-edit' onClick={() => onEdit(topic)} title='Sửa chủ đề'>
                          <i className='fa-solid fa-pen' />
                        </button>
                        <button className='admin-btn-icon admin-btn-icon-delete' onClick={() => onDelete(topic)} title='Xoá chủ đề'>
                          <i className='fa-solid fa-trash' />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
