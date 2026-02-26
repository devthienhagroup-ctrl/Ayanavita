import { useEffect, useMemo, useRef, useState } from 'react'
import type { Appointment, Specialist } from '../../../api/spaAdmin.api'
import type { AppointmentsTabProps } from './types'

const statusLabelMap: Record<string, string> = {
  PENDING: 'Chưa xác nhận',
  CONFIRMED: 'Đã xác nhận',
  DONE: 'Khách đến',
  CANCELED: 'Khách không đến',
}

const statusClassMap: Record<string, string> = {
  PENDING: 'admin-badge-orange',
  CONFIRMED: 'admin-badge-blue',
  DONE: 'admin-badge-green',
  CANCELED: 'admin-badge-pastel',
}

type StatusValue = 'PENDING' | 'CONFIRMED' | 'DONE' | 'CANCELED'
type ChartType = 'bar' | 'line' | 'doughnut' | 'polarArea'

declare global {
  interface Window {
    Chart?: any
    __chartJsLoading?: Promise<any>
  }
}

const loadChartJs = () => {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.Chart) return Promise.resolve(window.Chart)
  if (window.__chartJsLoading) return window.__chartJsLoading

  window.__chartJsLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js'
    script.async = true
    script.onload = () => resolve(window.Chart)
    script.onerror = () => reject(new Error('Không tải được Chart.js từ CDN'))
    document.head.appendChild(script)
  })

  return window.__chartJsLoading
}

function ChartJsPanel(props: {
  title: string
  type: ChartType
  labels: string[]
  values: number[]
  colors: string[]
  options?: Record<string, unknown>
}) {
  const { title, type, labels, values, colors, options } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<any>(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true

    const render = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      try {
        const Chart = await loadChartJs()
        if (!active || !Chart) return

        chartRef.current?.destroy?.()

        chartRef.current = new Chart(canvas, {
          type,
          data: {
            labels,
            datasets: [{
              label: title,
              data: values,
              backgroundColor: colors,
              borderColor: '#1e293b',
              borderWidth: type === 'line' ? 2 : 1,
              pointRadius: type === 'line' ? 4 : 0,
              pointBackgroundColor: '#334155',
              tension: 0.35,
              fill: type === 'line',
            }],
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                display: type !== 'bar' || labels.length <= 1,
                position: 'bottom',
              },
            },
            scales: type === 'doughnut' || type === 'polarArea'
              ? undefined
              : {
                x: {
                  ticks: { color: '#475569' },
                  grid: { color: 'rgba(148, 163, 184, 0.22)' },
                },
                y: {
                  beginAtZero: true,
                  ticks: { color: '#475569', precision: 0 },
                  grid: { color: 'rgba(148, 163, 184, 0.22)' },
                },
              },
            ...options,
          },
        })

        setLoadError('')
      } catch {
        if (active) setLoadError('Không tải được Chart.js (CDN bị chặn trong môi trường hiện tại).')
      }
    }

    void render()

    return () => {
      active = false
      chartRef.current?.destroy?.()
      chartRef.current = null
    }
  }, [colors, labels, options, title, type, values])

  return (
    <article className='admin-stat-card'>
      <span>{title}</span>
      <div className='admin-chart-host'>
        <canvas ref={canvasRef} className='admin-chart-canvas' />
      </div>
      {loadError && <small className='admin-helper'>{loadError}</small>}
    </article>
  )
}

function statusActionItems(isStaff: boolean) {
  const adminItems: Array<{ value: StatusValue; label: string }> = [
    { value: 'PENDING', label: statusLabelMap.PENDING },
    { value: 'CONFIRMED', label: statusLabelMap.CONFIRMED },
    { value: 'DONE', label: statusLabelMap.DONE },
    { value: 'CANCELED', label: statusLabelMap.CANCELED },
  ]
  if (!isStaff) return adminItems
  return adminItems.filter((item) => item.value === 'DONE' || item.value === 'CANCELED')
}

export function AppointmentsTab({ appointments, specialists, branches, services, isStaff, loading, onAssignSpecialist, onUpdateStatus, onDeleteAppointment }: AppointmentsTabProps) {
  const [view, setView] = useState<'list' | 'stats'>('list')
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [branchId, setBranchId] = useState(0)
  const [serviceId, setServiceId] = useState(0)
  const [specialistId, setSpecialistId] = useState(0)
  const [filterMonth, setFilterMonth] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [actionMenuId, setActionMenuId] = useState<number | null>(null)
  const [detailAppointment, setDetailAppointment] = useState<Appointment | null>(null)

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const date = new Date(item.appointmentAt)
      const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const dayValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      if (searchName.trim() && !item.customerName.toLowerCase().includes(searchName.trim().toLowerCase())) return false
      if (searchPhone.trim() && !item.customerPhone.toLowerCase().includes(searchPhone.trim().toLowerCase())) return false
      if (branchId && item.branch?.id !== branchId) return false
      if (serviceId && item.service?.id !== serviceId) return false
      if (specialistId && item.specialist?.id !== specialistId) return false
      if (filterMonth && monthValue !== filterMonth) return false
      if (filterDate && dayValue !== filterDate) return false
      return true
    })
  }, [appointments, branchId, filterDate, filterMonth, searchName, searchPhone, serviceId, specialistId])

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pagedAppointments = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredAppointments.slice(start, start + pageSize)
  }, [filteredAppointments, pageSize, safePage])

  const statusStats = useMemo(() => {
    return filteredAppointments.reduce<Record<string, number>>((acc, item) => {
      const status = item.status || 'PENDING'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})
  }, [filteredAppointments])

  const specialistStats = useMemo(() => {
    const bucket = new Map<string, number>()
    filteredAppointments.forEach((item) => {
      const key = item.specialist?.name || 'Chưa phân công'
      bucket.set(key, (bucket.get(key) || 0) + 1)
    })
    return [...bucket.entries()].sort((a, b) => b[1] - a[1])
  }, [filteredAppointments])

  const serviceStats = useMemo(() => {
    const bucket = new Map<string, number>()
    filteredAppointments.forEach((item) => {
      const key = item.service?.name || 'Khác'
      bucket.set(key, (bucket.get(key) || 0) + 1)
    })
    return [...bucket.entries()].sort((a, b) => b[1] - a[1])
  }, [filteredAppointments])

  const monthStats = useMemo(() => {
    const bucket = new Map<string, number>()
    filteredAppointments.forEach((item) => {
      const date = new Date(item.appointmentAt)
      const key = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
      bucket.set(key, (bucket.get(key) || 0) + 1)
    })
    return [...bucket.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [filteredAppointments])

  return (
    <section className='admin-card admin-card-glow'>
      <div className='admin-row admin-row-between'>
        <h3 className='admin-card-title'><i className='fa-solid fa-calendar-days' /> Lịch hẹn ({filteredAppointments.length})</h3>
        <div className='admin-row'>
          <button className={`admin-btn admin-btn-ghost ${view === 'list' ? 'admin-btn-active' : ''}`} onClick={() => setView('list')}>Danh sách</button>
          <button className={`admin-btn admin-btn-ghost ${view === 'stats' ? 'admin-btn-active' : ''}`} onClick={() => setView('stats')}>Thống kê</button>
        </div>
      </div>

      <div className='admin-filters-grid'>
        <input className='admin-input' placeholder='Tên khách' value={searchName} onChange={(e) => { setSearchName(e.target.value); setPage(1) }} />
        <input className='admin-input' placeholder='Số điện thoại' value={searchPhone} onChange={(e) => { setSearchPhone(e.target.value); setPage(1) }} />
        <select className='admin-input' value={branchId} onChange={(e) => { setBranchId(Number(e.target.value)); setPage(1) }}>
          <option value={0}>Tất cả chi nhánh</option>
          {branches.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select className='admin-input' value={serviceId} onChange={(e) => { setServiceId(Number(e.target.value)); setPage(1) }}>
          <option value={0}>Tất cả dịch vụ</option>
          {services.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select className='admin-input' value={specialistId} onChange={(e) => { setSpecialistId(Number(e.target.value)); setPage(1) }}>
          <option value={0}>Tất cả chuyên viên</option>
          {specialists.map((item: Specialist) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <input className='admin-input' type='month' value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setPage(1) }} />
        <input className='admin-input' type='date' value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1) }} />
        <select className='admin-input' value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
        </select>
      </div>

      {view === 'stats' ? (
        <div className='admin-grid admin-grid-stats'>
          {!isStaff && (
            <ChartJsPanel
              title='Theo trạng thái (Doughnut)'
              type='doughnut'
              labels={Object.entries(statusLabelMap).map(([, label]) => label)}
              values={Object.keys(statusLabelMap).map((key) => statusStats[key] || 0)}
              colors={['#f59e0b', '#3b82f6', '#16a34a', '#ef4444']}
            />
          )}

          {!isStaff && (
            <ChartJsPanel
              title='Theo chuyên viên (Bar ngang)'
              type='bar'
              labels={specialistStats.slice(0, 8).map(([label]) => label)}
              values={specialistStats.slice(0, 8).map(([, value]) => value)}
              colors={specialistStats.slice(0, 8).map((_, idx) => idx % 2 === 0 ? '#4f46e5cc' : '#0ea5e9cc')}
              options={{ indexAxis: 'y' }}
            />
          )}

          {!isStaff && (
            <ChartJsPanel
              title='Theo tháng (Line)'
              type='line'
              labels={monthStats.slice(-12).map(([label]) => label)}
              values={monthStats.slice(-12).map(([, value]) => value)}
              colors={['#0ea5e9']}
              options={{ plugins: { legend: { display: false } } }}
            />
          )}

          {!isStaff && (
            <ChartJsPanel
              title='Theo dịch vụ (Polar Area)'
              type='polarArea'
              labels={serviceStats.slice(0, 6).map(([label]) => label)}
              values={serviceStats.slice(0, 6).map(([, value]) => value)}
              colors={['#8b5cf6', '#06b6d4', '#f59e0b', '#16a34a', '#ef4444', '#3b82f6']}
            />
          )}

          {isStaff && (
            <ChartJsPanel
              title='Lịch hẹn theo thời gian (Line)'
              type='line'
              labels={monthStats.slice(-8).map(([label]) => label)}
              values={monthStats.slice(-8).map(([, value]) => value)}
              colors={['#4f46e5']}
              options={{ plugins: { legend: { display: false } } }}
            />
          )}

          {isStaff && (
            <ChartJsPanel
              title='Lịch hẹn theo dịch vụ (Bar)'
              type='bar'
              labels={serviceStats.slice(0, 6).map(([label]) => label)}
              values={serviceStats.slice(0, 6).map(([, value]) => value)}
              colors={['#0ea5e9aa']}
              options={{ plugins: { legend: { display: false } } }}
            />
          )}

          {isStaff && (
            <ChartJsPanel
              title='Theo trạng thái (Doughnut)'
              type='doughnut'
              labels={Object.entries(statusLabelMap).map(([, label]) => label)}
              values={Object.keys(statusLabelMap).map((key) => statusStats[key] || 0)}
              colors={['#f59e0b', '#3b82f6', '#16a34a', '#ef4444']}
            />
          )}
        </div>
      ) : (
        <>
          <div className='admin-table-wrap'>
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Khách hàng</th>
                  <th>SĐT</th>
                  <th>Chi nhánh</th>
                  <th>Dịch vụ</th>
                  <th>Chuyên viên</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pagedAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className='td-strong'>{appointment.code || `#${appointment.id}`}</td>
                    <td>{appointment.customerName}</td>
                    <td>{appointment.customerPhone}</td>
                    <td>{appointment.branch?.name || '-'}</td>
                    <td>{appointment.service?.name || '-'}</td>
                    <td>
                      {isStaff ? (
                        appointment.specialist?.name || '-'
                      ) : (
                        <select className='admin-input' value={appointment.specialist?.id ?? ''} onChange={(e) => onAssignSpecialist(appointment, e.target.value ? Number(e.target.value) : null)}>
                          <option value=''>Chưa phân công</option>
                          {specialists
                            .filter((item) => item.branchId === appointment.branch?.id && item.serviceIds.includes(appointment.service?.id || 0))
                            .map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </select>
                      )}
                    </td>
                    <td><span className={`admin-badge ${statusClassMap[appointment.status] || 'admin-badge-orange'}`}>{statusLabelMap[appointment.status] || appointment.status}</span></td>
                    <td>
                      <div className='admin-action-menu-wrap'>
                        <button className='admin-btn admin-btn-ghost' onClick={() => setActionMenuId((prev) => prev === appointment.id ? null : appointment.id)}><i className='fa-solid fa-ellipsis' /></button>
                        {actionMenuId === appointment.id && (
                          <div className='admin-action-menu'>
                            {statusActionItems(isStaff).map((item) => (
                              <button key={item.value} className='admin-btn admin-btn-ghost' disabled={appointment.status === item.value || loading} onClick={() => { setActionMenuId(null); void onUpdateStatus(appointment, item.value) }}>
                                {item.label}
                              </button>
                            ))}
                            <button className='admin-btn admin-btn-ghost' onClick={() => { setDetailAppointment(appointment); setActionMenuId(null) }}>Xem chi tiết</button>
                            {!isStaff && <button className='admin-btn admin-btn-danger' onClick={() => { setActionMenuId(null); void onDeleteAppointment(appointment) }}>Xóa lịch</button>}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='admin-row admin-row-between'>
            <span className='admin-helper'>Hiển thị {pagedAppointments.length}/{filteredAppointments.length} lịch hẹn</span>
            <div className='admin-row'>
              <button className='admin-btn admin-btn-ghost' disabled={safePage <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>Trước</button>
              <span className='admin-helper'>Trang {safePage}/{totalPages}</span>
              <button className='admin-btn admin-btn-ghost' disabled={safePage >= totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>Sau</button>
            </div>
          </div>
        </>
      )}

      {detailAppointment && (
        <div className='admin-modal-backdrop' onClick={() => setDetailAppointment(null)}>
          <div className='admin-modal' onClick={(e) => e.stopPropagation()}>
            <h4>Chi tiết lịch hẹn {detailAppointment.code || `#${detailAppointment.id}`}</h4>
            <div className='admin-detail-grid'>
              <p><strong>Khách hàng:</strong> {detailAppointment.customerName}</p>
              <p><strong>SĐT:</strong> {detailAppointment.customerPhone}</p>
              <p><strong>Email:</strong> {detailAppointment.customerEmail || '-'}</p>
              <p><strong>Trạng thái:</strong> {statusLabelMap[detailAppointment.status] || detailAppointment.status}</p>
              <p><strong>Chi nhánh:</strong> {detailAppointment.branch?.name || '-'}</p>
              <p><strong>Dịch vụ:</strong> {detailAppointment.service?.name || '-'}</p>
              <p><strong>Chuyên viên:</strong> {detailAppointment.specialist?.name || 'Chưa phân công'}</p>
              <p><strong>Thời gian:</strong> {new Date(detailAppointment.appointmentAt).toLocaleString('vi-VN')}</p>
              <p className='admin-detail-note'><strong>Ghi chú:</strong> {detailAppointment.note || 'Không có ghi chú'}</p>
            </div>
            <div className='admin-row'>
              <button className='admin-btn admin-btn-ghost' onClick={() => setDetailAppointment(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
