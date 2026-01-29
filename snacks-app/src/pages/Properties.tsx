import { useState, useRef, useEffect } from 'react'

const Properties = () => {
  const [dimensions, setDimensions] = useState({ width: 120, height: 1000 })
  const resizableRef = useRef<HTMLDivElement>(null)
  const isResizing = useRef(false)

  const initResize = (e: React.MouseEvent) => {
    isResizing.current = true
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !resizableRef.current) return

      const rect = resizableRef.current.getBoundingClientRect()
      let newWidth = ((e.clientX - rect.left) / window.innerWidth) * 100
      let newHeight = e.clientY - rect.top

      newWidth = Math.max(newWidth, 20)
      newHeight = Math.max(newHeight, 200)

      setDimensions({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      isResizing.current = false
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div className="container" style={{ overflow: 'visible' }}>
      <div
        ref={resizableRef}
        style={{
          position: 'relative',
          width: `${dimensions.width}%`,
          height: `${dimensions.height}px`,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <iframe
          src="https://docs.google.com/spreadsheets/d/15hSF6y0FEG7EfxGPN8YaM3yOWnKbNkvk/edit?usp=sharing&ouid=118123504268154946771&rtpof=true&sd=true"
          frameBorder="0"
          style={{ width: '100%', height: '100%' }}
          title="Properties Spreadsheet"
        ></iframe>
        <div
          onMouseDown={initResize}
          style={{
            width: '15px',
            height: '15px',
            background: '#ccc',
            position: 'absolute',
            right: 0,
            bottom: 0,
            cursor: 'se-resize',
          }}
        ></div>
      </div>
    </div>
  )
}

export default Properties
