import type { CourseAdmin } from '../../../api/adminCourses.api'

type Props = {
  courses: CourseAdmin[]
}

export function CoursesTab({ courses }: Props) {
  return (
    <section className='admin-card admin-card-glow'>
      <h3 className='admin-card-title'><i className='fa-solid fa-book' /> Khoá học hiện có ({courses.length})</h3>
      <div className='admin-table-wrap'>
        <table className='admin-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Slug</th>
              <th>Chủ đề</th>
              <th>Giá</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td className='td-strong'>{course.title}</td>
                <td>{course.slug}</td>
                <td>{course.topic?.name || 'Chưa gán'}</td>
                <td>{course.price.toLocaleString('vi-VN')}đ</td>
                <td>{course.published ? 'Published' : 'Draft'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
