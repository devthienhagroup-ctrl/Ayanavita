import { useEffect, useMemo, useState } from 'react'
import { adminCoursesApi, type CourseAdmin, type CourseTopic } from '../../api/adminCourses.api'
import { AlertJs } from '../../utils/alertJs'
import { CoursesTab } from './courseTabs/CoursesTab'
import { TopicsTab } from './courseTabs/TopicsTab'
import './AdminSpaPage.css'
import './AdminCoursesPage.css'

type TabKey = 'topics' | 'courses'
type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'admin-courses-theme-mode'

export default function AdminCoursesPage() {
  const [tab, setTab] = useState<TabKey>('topics')
  const [topics, setTopics] = useState<CourseTopic[]>([])
  const [courses, setCourses] = useState<CourseAdmin[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    return saved === 'dark' ? 'dark' : 'light'
  })

  const loadAll = async () => {
    setLoading(true)
    try {
      const [topicItems, courseItems] = await Promise.all([adminCoursesApi.listTopics(), adminCoursesApi.listCourses()])
      setTopics(topicItems)
      setCourses(courseItems)
    } catch (e: any) {
      AlertJs.error(e?.message || 'Không thể tải dữ liệu quản trị khóa học')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAll()
  }, [])

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const resetForm = () => {
    setName('')
    setDescription('')
    setEditingId(null)
  }

  const coursesByTopic = useMemo(() => {
    const map: Record<number, number> = {}
    courses.forEach((course) => {
      if (course.topicId) map[course.topicId] = (map[course.topicId] || 0) + 1
    })
    return map
  }, [courses])

  const saveTopic = async () => {
    if (!name.trim()) {
      AlertJs.error('Vui lòng nhập tên chủ đề khóa học')
      return
    }
    try {
      if (editingId) {
        await adminCoursesApi.updateTopic(editingId, { name: name.trim(), description: description.trim() || undefined })
        AlertJs.success('Đã cập nhật chủ đề')
      } else {
        await adminCoursesApi.createTopic({ name: name.trim(), description: description.trim() || undefined })
        AlertJs.success('Đã tạo chủ đề mới')
      }
      resetForm()
      await loadAll()
    } catch (e: any) {
      AlertJs.error(e?.message || 'Lưu chủ đề thất bại')
    }
  }

  const deleteTopic = async (topic: CourseTopic) => {
    try {
      await adminCoursesApi.deleteTopic(topic.id)
      AlertJs.success('Đã xóa chủ đề thành công')
      await loadAll()
    } catch (e: any) {
      AlertJs.error(e?.message || 'Không thể xóa chủ đề')
    }
  }

  const startEditTopic = (topic: CourseTopic) => {
    setEditingId(topic.id)
    setName(topic.name)
    setDescription(topic.description || '')
  }

  return (
    <main className={`admin-page admin-courses-theme ${theme === 'dark' ? 'admin-courses-theme-dark' : ''}`}>
      <section className='admin-header'>
        <div>
          <p className='admin-header-kicker'>TRUNG TÂM QUẢN TRỊ KHÓA HỌC</p>
          <h1>Quản trị chủ đề & danh mục khóa học</h1>
          <p>Giao diện đồng bộ với quản trị dịch vụ, tập trung CRUD chủ đề và theo dõi khóa học theo từng chủ đề.</p>
        </div>

        <div className='admin-courses-theme-switch' role='group' aria-label='Chuyển chế độ giao diện'>
          <span className='admin-courses-theme-switch-label'>Dark mode</span>
          <button
            type='button'
            className={`admin-courses-theme-toggle ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            aria-pressed={theme === 'dark'}
          >
            <span className='admin-courses-theme-toggle-thumb' />
          </button>
        </div>
      </section>

      <section className='admin-overview'>
        <article className='overview-card'>
          <span><i className='fa-solid fa-layer-group' /> Chủ đề khóa học</span>
          <strong>{topics.length}</strong>
          <small>Danh mục chủ đề hiện có</small>
        </article>
        <article className='overview-card'>
          <span><i className='fa-solid fa-book-open-reader' /> Tổng khóa học</span>
          <strong>{courses.length}</strong>
          <small>Khoá học đang quản lý</small>
        </article>
        <article className='overview-card'>
          <span><i className='fa-solid fa-circle-check' /> Đã xuất bản</span>
          <strong>{courses.filter((course) => course.published).length}</strong>
          <small>Khoá học trạng thái Published</small>
        </article>
        <article className='overview-card'>
          <span><i className='fa-solid fa-pen-to-square' /> Bản nháp</span>
          <strong>{courses.filter((course) => !course.published).length}</strong>
          <small>Khoá học trạng thái Draft</small>
        </article>
      </section>

      <section className='admin-tabs'>
        <button className={`admin-tab ${tab === 'topics' ? 'active' : ''}`} onClick={() => setTab('topics')}>
          <i className='fa-solid fa-tags' /> Chủ đề khóa học
        </button>
        <button className={`admin-tab ${tab === 'courses' ? 'active' : ''}`} onClick={() => setTab('courses')}>
          <i className='fa-solid fa-graduation-cap' /> Khoá học hiện có
        </button>
      </section>

      {loading && <p className='admin-helper'>Đang tải dữ liệu...</p>}

      {!loading && tab === 'topics' && (
        <TopicsTab
          topics={topics}
          coursesByTopic={coursesByTopic}
          name={name}
          description={description}
          editingId={editingId}
          setName={setName}
          setDescription={setDescription}
          onSave={saveTopic}
          onReset={resetForm}
          onEdit={startEditTopic}
          onDelete={(topic) => {
            void deleteTopic(topic)
          }}
        />
      )}

      {!loading && tab === 'courses' && <CoursesTab courses={courses} />}
    </main>
  )
}
